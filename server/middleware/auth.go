package middleware

import (
	"context"
	"encoding/json"
	"net/http"

	"portfolio-manager/server/utils"
)

type ctxKey string

const UserIDKey ctxKey = "userID"

func writeErr(w http.ResponseWriter, status int, msg string) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	json.NewEncoder(w).Encode(map[string]string{"message": msg})
}

func RequireAuth(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			writeErr(w, http.StatusUnauthorized, "not authenticated")
			return
		}
		claims, err := utils.ValidateToken(cookie.Value)
		if err != nil {
			writeErr(w, http.StatusUnauthorized, "invalid token")
			return
		}
		ctx := context.WithValue(r.Context(), UserIDKey, claims.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func UserIDFrom(r *http.Request) string {
	v, _ := r.Context().Value(UserIDKey).(string)
	return v
}
