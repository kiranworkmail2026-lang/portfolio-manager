package main

import (
	"log"
	"net/http"
	"os"

	"github.com/go-chi/chi/v5"
	chimw "github.com/go-chi/chi/v5/middleware"
	"github.com/joho/godotenv"

	"portfolio-manager/server/config"
	"portfolio-manager/server/handlers"
	"portfolio-manager/server/middleware"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("no .env file found, relying on environment")
	}

	if err := config.ConnectDB(); err != nil {
		log.Fatalf("db connect failed: %v", err)
	}

	r := chi.NewRouter()
	r.Use(chimw.Logger)
	r.Use(chimw.Recoverer)
	r.Use(middleware.CORS())

	r.Get("/api/health", handlers.Health)

	r.Route("/api/auth", func(r chi.Router) {
		r.Post("/register", handlers.Register)
		r.Post("/login", handlers.Login)
		r.Post("/logout", handlers.Logout)
		r.Group(func(r chi.Router) {
			r.Use(middleware.RequireAuth)
			r.Get("/me", handlers.Me)
		})
	})

	r.Route("/api/portfolio", func(r chi.Router) {
		r.Use(middleware.RequireAuth)
		r.Post("/upload", handlers.Upload)
		r.Get("/", handlers.List)
		r.Get("/{id}", handlers.GetOne)
		r.Delete("/{id}", handlers.Delete)
	})

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	log.Printf("🚀 server listening on :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, r))
}
