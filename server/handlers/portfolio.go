package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"portfolio-manager/server/config"
	"portfolio-manager/server/middleware"
	"portfolio-manager/server/models"
	"portfolio-manager/server/utils"
)

func Upload(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}

	if err := r.ParseMultipartForm(10 << 20); err != nil {
		writeErr(w, http.StatusBadRequest, "could not parse form")
		return
	}
	file, header, err := r.FormFile("file")
	if err != nil {
		writeErr(w, http.StatusBadRequest, "file required")
		return
	}
	defer file.Close()

	name := r.FormValue("name")
	if name == "" {
		name = "My Portfolio"
	}

	holdings, err := utils.ParseHoldings(file, header.Filename)
	if err != nil {
		writeErr(w, http.StatusBadRequest, err.Error())
		return
	}

	now := time.Now()
	p := models.Portfolio{
		UserID:     userID,
		Name:       name,
		Holdings:   holdings,
		UploadedAt: now,
		CreatedAt:  now,
		UpdatedAt:  now,
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	res, err := config.Portfolios().InsertOne(ctx, p)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "insert error")
		return
	}
	p.ID = res.InsertedID.(primitive.ObjectID)
	writeJSON(w, http.StatusCreated, map[string]interface{}{"data": p})
}

func List(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	cur, err := config.Portfolios().Find(ctx, bson.M{"userId": userID})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	var portfolios []models.Portfolio
	if err := cur.All(ctx, &portfolios); err != nil {
		writeErr(w, http.StatusInternalServerError, "decode error")
		return
	}
	if portfolios == nil {
		portfolios = []models.Portfolio{}
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": portfolios})
}

func GetOne(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	pid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	var p models.Portfolio
	if err := config.Portfolios().FindOne(ctx, bson.M{"_id": pid, "userId": userID}).Decode(&p); err != nil {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": p})
}

func Delete(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	userID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	id := chi.URLParam(r, "id")
	pid, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		writeErr(w, http.StatusBadRequest, "invalid id")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	res, err := config.Portfolios().DeleteOne(ctx, bson.M{"_id": pid, "userId": userID})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	if res.DeletedCount == 0 {
		writeErr(w, http.StatusNotFound, "not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]string{"message": "deleted"})
}

// Health for sanity checks.
func Health(w http.ResponseWriter, r *http.Request) {
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": map[string]string{"status": "ok"}})
}

// guard against unused import if json isn't otherwise used here
var _ = json.Marshal
