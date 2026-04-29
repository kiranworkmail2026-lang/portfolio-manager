package handlers

import (
	"context"
	"encoding/json"
	"net/http"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"

	"portfolio-manager/server/config"
	"portfolio-manager/server/middleware"
	"portfolio-manager/server/models"
	"portfolio-manager/server/utils"
)

func writeJSON(w http.ResponseWriter, status int, v interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(v)
}

func writeErr(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"message": msg})
}

func setTokenCookie(w http.ResponseWriter, token string) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token,
		Path:     "/",
		HttpOnly: true,
		Secure:   false, // local dev
		SameSite: http.SameSiteLaxMode,
		Expires:  time.Now().Add(7 * 24 * time.Hour),
	})
}

type registerReq struct {
	Name     string `json:"name"`
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Register(w http.ResponseWriter, r *http.Request) {
	var req registerReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))
	if req.Name == "" || req.Email == "" || len(req.Password) < 6 {
		writeErr(w, http.StatusBadRequest, "name, email, and password (>=6) required")
		return
	}

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	count, err := config.Users().CountDocuments(ctx, bson.M{"email": req.Email})
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	if count > 0 {
		writeErr(w, http.StatusBadRequest, "email already registered")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "hash error")
		return
	}
	now := time.Now()
	user := models.User{
		Name:      req.Name,
		Email:     req.Email,
		Password:  string(hash),
		CreatedAt: now,
		UpdatedAt: now,
	}
	res, err := config.Users().InsertOne(ctx, user)
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "insert error")
		return
	}
	user.ID = res.InsertedID.(primitive.ObjectID)
	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "token error")
		return
	}
	setTokenCookie(w, token)
	writeJSON(w, http.StatusCreated, map[string]interface{}{"data": user})
}

type loginReq struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

func Login(w http.ResponseWriter, r *http.Request) {
	var req loginReq
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		writeErr(w, http.StatusBadRequest, "invalid body")
		return
	}
	req.Email = strings.ToLower(strings.TrimSpace(req.Email))

	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()

	var user models.User
	err := config.Users().FindOne(ctx, bson.M{"email": req.Email}).Decode(&user)
	if err == mongo.ErrNoDocuments {
		writeErr(w, http.StatusUnauthorized, "invalid credentials")
		return
	}
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "db error")
		return
	}
	if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(req.Password)); err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid credentials")
		return
	}
	token, err := utils.GenerateToken(user.ID.Hex())
	if err != nil {
		writeErr(w, http.StatusInternalServerError, "token error")
		return
	}
	setTokenCookie(w, token)
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": user})
}

func Logout(w http.ResponseWriter, r *http.Request) {
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    "",
		Path:     "/",
		HttpOnly: true,
		Expires:  time.Unix(0, 0),
		MaxAge:   -1,
	})
	writeJSON(w, http.StatusOK, map[string]string{"message": "logged out"})
}

func Me(w http.ResponseWriter, r *http.Request) {
	uid := middleware.UserIDFrom(r)
	objID, err := primitive.ObjectIDFromHex(uid)
	if err != nil {
		writeErr(w, http.StatusUnauthorized, "invalid user")
		return
	}
	ctx, cancel := context.WithTimeout(r.Context(), 10*time.Second)
	defer cancel()
	var user models.User
	if err := config.Users().FindOne(ctx, bson.M{"_id": objID}).Decode(&user); err != nil {
		writeErr(w, http.StatusNotFound, "user not found")
		return
	}
	writeJSON(w, http.StatusOK, map[string]interface{}{"data": user})
}
