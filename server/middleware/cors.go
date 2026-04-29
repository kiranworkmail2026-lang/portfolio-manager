package middleware

import (
	"net/http"
	"os"

	"github.com/go-chi/cors"
)

func CORS() func(http.Handler) http.Handler {
	clientURL := os.Getenv("CLIENT_URL")
	if clientURL == "" {
		clientURL = "http://localhost:3000"
	}
	return cors.Handler(cors.Options{
		AllowedOrigins:   []string{clientURL},
		AllowedMethods:   []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
		MaxAge:           300,
	})
}
