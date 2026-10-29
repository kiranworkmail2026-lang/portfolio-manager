// Command seedblog inserts the blog posts in posts.json into MongoDB.
//
// It is idempotent: a post whose title already exists is skipped, so running
// it twice does not duplicate anything.
//
//	go run ./cmd/seedblog -author you@example.com -dry-run   # show what would happen
//	go run ./cmd/seedblog -author you@example.com            # insert as published
//	go run ./cmd/seedblog -author you@example.com -draft     # insert as drafts
//
// Slugs and excerpts are produced the same way handlers/posts.go produces them,
// so seeded posts are indistinguishable from ones written in the editor.
package main

import (
	"context"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"os"
	"regexp"
	"strings"
	"time"
	"unicode/utf8"

	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

type seedPost struct {
	Title   string `json:"title"`
	Content string `json:"content"`
}

var (
	slugRe  = regexp.MustCompile(`[^a-z0-9]+`)
	htmlTag = regexp.MustCompile(`<[^>]*>`)
)

// slugify mirrors handlers.slugify.
func slugify(s string) string {
	s = strings.ToLower(strings.TrimSpace(s))
	s = slugRe.ReplaceAllString(s, "-")
	s = strings.Trim(s, "-")
	if s == "" {
		s = "post"
	}
	if len(s) > 80 {
		s = s[:80]
		s = strings.Trim(s, "-")
	}
	return s
}

// makeExcerpt mirrors handlers.makeExcerpt.
func makeExcerpt(html string, max int) string {
	plain := htmlTag.ReplaceAllString(html, " ")
	plain = strings.Join(strings.Fields(plain), " ")
	if utf8.RuneCountInString(plain) <= max {
		return plain
	}
	r := []rune(plain)
	return strings.TrimSpace(string(r[:max])) + "…"
}

// uniqueSlug mirrors handlers.uniqueSlug.
func uniqueSlug(ctx context.Context, posts *mongo.Collection, base string) (string, error) {
	candidate := base
	for i := 1; i < 50; i++ {
		n, err := posts.CountDocuments(ctx, bson.M{"slug": candidate, "status": "published"})
		if err != nil {
			return "", err
		}
		if n == 0 {
			return candidate, nil
		}
		candidate = fmt.Sprintf("%s-%d", base, i+1)
	}
	return fmt.Sprintf("%s-%d", base, time.Now().Unix()), nil
}

func main() {
	authorEmail := flag.String("author", "", "email of an existing user to attribute the posts to (required)")
	file := flag.String("file", "cmd/seedblog/posts.json", "path to the posts JSON file")
	draft := flag.Bool("draft", false, "insert as drafts instead of publishing")
	dryRun := flag.Bool("dry-run", false, "report what would be inserted, change nothing")
	spacing := flag.Duration("spacing", 48*time.Hour, "gap between publishedAt timestamps, newest first")
	flag.Parse()

	if *authorEmail == "" {
		log.Fatal("-author is required: posts must be attributed to an existing account")
	}

	_ = godotenv.Load(".env")
	uri := os.Getenv("MONGODB_URI")
	if uri == "" {
		log.Fatal("MONGODB_URI not set")
	}

	raw, err := os.ReadFile(*file)
	if err != nil {
		log.Fatalf("read %s: %v", *file, err)
	}
	var seeds []seedPost
	if err := json.Unmarshal(raw, &seeds); err != nil {
		log.Fatalf("parse %s: %v", *file, err)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 90*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(uri))
	if err != nil {
		log.Fatalf("mongo connect: %v", err)
	}
	defer client.Disconnect(ctx)

	db := client.Database("portfolio-app")
	users := db.Collection("users")
	posts := db.Collection("posts")

	var author struct {
		ID   primitive.ObjectID `bson:"_id"`
		Name string             `bson:"name"`
	}
	err = users.FindOne(ctx, bson.M{"email": strings.ToLower(strings.TrimSpace(*authorEmail))}).Decode(&author)
	if err != nil {
		log.Fatalf("no account found for %q — create it first, then re-run: %v", *authorEmail, err)
	}

	status := "published"
	if *draft {
		status = "draft"
	}
	log.Printf("author: %s (%s) · status: %s · posts in file: %d", author.Name, *authorEmail, status, len(seeds))
	if *dryRun {
		log.Println("dry run — nothing will be written")
	}

	now := time.Now()
	inserted, skipped := 0, 0

	for i, sp := range seeds {
		title := strings.TrimSpace(sp.Title)
		if title == "" || strings.TrimSpace(sp.Content) == "" {
			log.Printf("  [%2d] SKIP  empty title or content", i+1)
			skipped++
			continue
		}

		// Idempotency: never insert the same title twice.
		n, err := posts.CountDocuments(ctx, bson.M{"title": title})
		if err != nil {
			log.Fatalf("count by title: %v", err)
		}
		if n > 0 {
			log.Printf("  [%2d] SKIP  already present: %s", i+1, title)
			skipped++
			continue
		}

		// Newest first, so the blog index reads in a sensible order.
		stamp := now.Add(-time.Duration(i) * *spacing)

		doc := bson.M{
			"authorId":   author.ID,
			"authorName": author.Name,
			"title":      title,
			"content":    sp.Content,
			"excerpt":    makeExcerpt(sp.Content, 200),
			"status":     status,
			"createdAt":  stamp,
			"updatedAt":  stamp,
		}

		if status == "published" {
			slug, err := uniqueSlug(ctx, posts, slugify(title))
			if err != nil {
				log.Fatalf("slug for %q: %v", title, err)
			}
			doc["slug"] = slug
			doc["publishedAt"] = stamp
			log.Printf("  [%2d] %s  /blog/%s", i+1, map[bool]string{true: "WOULD ADD", false: "ADDED    "}[*dryRun], slug)
		} else {
			doc["slug"] = "" // assigned by the app on first publish
			log.Printf("  [%2d] %s  draft: %s", i+1, map[bool]string{true: "WOULD ADD", false: "ADDED    "}[*dryRun], title)
		}

		if !*dryRun {
			if _, err := posts.InsertOne(ctx, doc); err != nil {
				log.Fatalf("insert %q: %v", title, err)
			}
		}
		inserted++
	}

	verb := "inserted"
	if *dryRun {
		verb = "would insert"
	}
	log.Printf("done — %s %d, skipped %d", verb, inserted, skipped)
}
