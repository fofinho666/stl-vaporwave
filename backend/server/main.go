package main

import (
	"crypto/subtle"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/fofinho666/stl-vaporwave/server/handlers"
	"github.com/gorilla/mux"
	"github.com/joho/godotenv"
)

var StorageFolder = "./storage"

func main() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
		return
	}

	handlers.StorageFolder = StorageFolder

	r := mux.NewRouter()
	r.Use(LogMiddleware)
	r.HandleFunc("/api/files", handlers.FilesIndex).Methods("GET")
	r.HandleFunc("/api/files", BasicAuth(handlers.FilesCreate)).Methods("POST")
	r.HandleFunc("/api/files/{filename}", handlers.FileIndex).Methods("GET")

	srv := &http.Server{
		Handler:      r,
		Addr:         ":4000",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("STL Vaporwave file upload backend")
	log.Println("Running at http://0.0.0.0:4000")

	log.Fatal(srv.ListenAndServe())
}

func LogMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%v %v - %v\n", r.RemoteAddr, r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}

func BasicAuth(handler http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		username := os.Getenv("AUTH_USERNAME")
		password := os.Getenv("AUTH_PASSWORD")
		user, pass, ok := r.BasicAuth()

		if !ok || subtle.ConstantTimeCompare([]byte(user), []byte(username)) != 1 || subtle.ConstantTimeCompare([]byte(pass), []byte(password)) != 1 {
			w.Header().Set("WWW-Authenticate", "Basic realm=\"Please enter the correct username and password\"")
			w.WriteHeader(401)
			w.Write([]byte("Unauthorised.\n"))
			return
		}

		handler(w, r)
	}
}
