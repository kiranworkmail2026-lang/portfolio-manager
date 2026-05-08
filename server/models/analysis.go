package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Analysis struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID      primitive.ObjectID `bson:"userId" json:"userId"`
	Question    string             `bson:"question" json:"question"`
	Answer      string             `bson:"answer" json:"answer"`
	Trace       []string           `bson:"trace" json:"trace"`
	TraceCount  int                `bson:"traceCount" json:"traceCount"`
	AgentPath   []string           `bson:"agentPath" json:"agentPath"`
	ToolCalls   []string           `bson:"toolCalls" json:"toolCalls"`
	Status      string             `bson:"status" json:"status"` // pending | success | error
	ErrorMsg    string             `bson:"error,omitempty" json:"error,omitempty"`
	DurationMs  int64              `bson:"durationMs" json:"durationMs"`
	CreatedAt   time.Time          `bson:"createdAt" json:"createdAt"`
	CompletedAt time.Time          `bson:"completedAt,omitempty" json:"completedAt,omitempty"`
}
