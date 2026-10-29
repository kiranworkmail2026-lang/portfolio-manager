package main

import (
	"encoding/json"
	"os"
	"strings"
	"testing"
)

// loadSeeds reads the posts file the command ships with.
func loadSeeds(t *testing.T) []seedPost {
	t.Helper()
	raw, err := os.ReadFile("posts.json")
	if err != nil {
		t.Fatalf("read posts.json: %v", err)
	}
	var seeds []seedPost
	if err := json.Unmarshal(raw, &seeds); err != nil {
		t.Fatalf("parse posts.json: %v", err)
	}
	return seeds
}

func TestSeedPostsAreWellFormed(t *testing.T) {
	seeds := loadSeeds(t)

	if len(seeds) != 10 {
		t.Errorf("expected 10 posts, got %d", len(seeds))
	}

	titles := map[string]bool{}
	for i, p := range seeds {
		if strings.TrimSpace(p.Title) == "" {
			t.Errorf("post %d has an empty title", i+1)
		}
		if strings.TrimSpace(p.Content) == "" {
			t.Errorf("post %d (%q) has empty content", i+1, p.Title)
		}
		if titles[p.Title] {
			t.Errorf("duplicate title: %q", p.Title)
		}
		titles[p.Title] = true

		// Content is stored as HTML, the same as editor output.
		if !strings.Contains(p.Content, "<p>") {
			t.Errorf("post %q has no paragraph markup", p.Title)
		}
	}
}

func TestSlugsAreUniqueAndWellFormed(t *testing.T) {
	seeds := loadSeeds(t)

	seen := map[string]string{}
	for _, p := range seeds {
		slug := slugify(p.Title)

		if slug == "" || slug == "post" {
			t.Errorf("post %q produced a useless slug %q", p.Title, slug)
		}
		if len(slug) > 80 {
			t.Errorf("slug for %q is %d chars, over the 80 limit", p.Title, len(slug))
		}
		if strings.HasPrefix(slug, "-") || strings.HasSuffix(slug, "-") {
			t.Errorf("slug %q has a leading or trailing hyphen", slug)
		}
		for _, r := range slug {
			isLower := r >= 'a' && r <= 'z'
			isDigit := r >= '0' && r <= '9'
			if !isLower && !isDigit && r != '-' {
				t.Errorf("slug %q contains an unexpected character %q", slug, r)
				break
			}
		}
		// Collisions would silently become "-2" suffixes at insert time.
		if prev, ok := seen[slug]; ok {
			t.Errorf("slug %q collides: %q and %q", slug, prev, p.Title)
		}
		seen[slug] = p.Title
	}
}

func TestExcerptsAreUsable(t *testing.T) {
	seeds := loadSeeds(t)

	for _, p := range seeds {
		ex := makeExcerpt(p.Content, 200)

		if strings.Contains(ex, "<") || strings.Contains(ex, ">") {
			t.Errorf("excerpt for %q still contains markup: %q", p.Title, ex)
		}
		if strings.TrimSpace(ex) == "" {
			t.Errorf("excerpt for %q is empty", p.Title)
		}
		// 200 runes plus the ellipsis the app appends.
		if n := len([]rune(ex)); n > 201 {
			t.Errorf("excerpt for %q is %d runes, expected at most 201", p.Title, n)
		}
		if strings.Contains(ex, "  ") {
			t.Errorf("excerpt for %q has collapsed whitespace problems: %q", p.Title, ex)
		}
	}
}
