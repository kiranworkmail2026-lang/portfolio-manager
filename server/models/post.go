package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

// Post is a blog post authored by a user.
// Drafts are visible to author only; published are public via /api/blog.
// Content is stored as HTML (TipTap output).
type Post struct {
	ID                primitive.ObjectID  `bson:"_id,omitempty" json:"id"`
	AuthorID          primitive.ObjectID  `bson:"authorId" json:"authorId"`
	AuthorName        string              `bson:"authorName" json:"authorName"`
	Title             string              `bson:"title" json:"title"`
	Slug              string              `bson:"slug" json:"slug"`
	Content           string              `bson:"content" json:"content"`
	Excerpt           string              `bson:"excerpt" json:"excerpt"`
	Status            string              `bson:"status" json:"status"` // draft | published
	SourceAnalysisID  *primitive.ObjectID `bson:"sourceAnalysisId,omitempty" json:"sourceAnalysisId,omitempty"`
	CreatedAt         time.Time           `bson:"createdAt" json:"createdAt"`
	UpdatedAt         time.Time           `bson:"updatedAt" json:"updatedAt"`
	PublishedAt       *time.Time          `bson:"publishedAt,omitempty" json:"publishedAt,omitempty"`
}
