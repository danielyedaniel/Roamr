package main

import (
    "log"
    "net/http"

    "backend/config"
    "backend/db"
    "backend/handlers"
)

func main() {
    cfg := config.LoadConfig()

    database, err := db.Initialize(cfg)
    if err != nil {
        log.Fatalf("Could not connect to the database: %v", err)
    }
    defer db.CloseDB(database)

    mux := http.NewServeMux()
    mux.HandleFunc("/login", handlers.LoginHandler(database))
    mux.HandleFunc("/signup", handlers.SignupHandler(database))
    mux.HandleFunc("/search", handlers.SearchHandler(database))

    corsMux := setupCORS(mux)

    log.Fatal(http.ListenAndServe(":8000", corsMux))
}

func setupCORS(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

        if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }

        next.ServeHTTP(w, r)
    })
}
