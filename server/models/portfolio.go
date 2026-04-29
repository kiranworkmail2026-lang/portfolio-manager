package models

import (
	"time"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

type Holding struct {
	Symbol       string  `bson:"symbol" json:"symbol"`
	Name         string  `bson:"name" json:"name"`
	Quantity     float64 `bson:"quantity" json:"quantity"`
	BuyPrice     float64 `bson:"buyPrice" json:"buyPrice"`
	CurrentPrice float64 `bson:"currentPrice" json:"currentPrice"`
	Sector       string  `bson:"sector" json:"sector"`
	AssetType    string  `bson:"assetType" json:"assetType"`
}

type Portfolio struct {
	ID         primitive.ObjectID `bson:"_id,omitempty" json:"id"`
	UserID     primitive.ObjectID `bson:"userId" json:"userId"`
	Name       string             `bson:"name" json:"name"`
	Holdings   []Holding          `bson:"holdings" json:"holdings"`
	UploadedAt time.Time          `bson:"uploadedAt" json:"uploadedAt"`
	CreatedAt  time.Time          `bson:"createdAt" json:"createdAt"`
	UpdatedAt  time.Time          `bson:"updatedAt" json:"updatedAt"`
}
