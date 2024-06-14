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

    http.HandleFunc("/login", handlers.LoginHandler(database))
    http.HandleFunc("/signup", handlers.SignupHandler(database))

    log.Fatal(http.ListenAndServe(":8000", nil))
}
