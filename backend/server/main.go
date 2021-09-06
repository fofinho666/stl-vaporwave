package main

import (
	"crypto/subtle"
	"log"
	"net/http"
	"os"
	"time"

	rice "github.com/GeertJohan/go.rice"
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

	if _, err := os.Stat(StorageFolder); os.IsNotExist(err) {
		_ = os.Mkdir(StorageFolder, os.ModePerm)
	}

	handlers.StorageFolder = StorageFolder

	r := mux.NewRouter()
	r.Use(LogMiddleware)

	api := r.PathPrefix("/api/").Subrouter()
	api.HandleFunc("/files", handlers.FilesIndex).Methods("GET")
	api.HandleFunc("/files", BasicAuth(handlers.FilesCreate)).Methods("POST")
	api.HandleFunc("/files/{filename}", handlers.FileIndex).Methods("GET")

	r.PathPrefix("/").Handler(http.FileServer(rice.MustFindBox("../../frontend/dist").HTTPBox()))

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
