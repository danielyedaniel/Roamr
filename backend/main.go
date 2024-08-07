package main

import (
	"log"
	"net/http"

	"backend/config"
	"backend/db"
	"backend/handlers"
)

func main() {
	const apikey string = "ptmGMXRKNYZMNTjz8DlcSSmw4QbPSA1Re07B2ZDVZiY"

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
	mux.HandleFunc("/locationSearch", handlers.LocationSearchHandler(database))
	mux.HandleFunc("/post", handlers.PostHandler(database))
	mux.HandleFunc("/posts/user", handlers.GetPostsByUserHandler(database))
	mux.HandleFunc("/deletePost", handlers.DeletePostHandler(database))
	mux.HandleFunc("/follow", handlers.FollowHandler(database))
	mux.HandleFunc("/unfollow", handlers.UnfollowHandler(database))
	mux.HandleFunc("/postlocation", handlers.GetLocationsAndPostsByUserAndFollowingHandler(database))
	mux.HandleFunc("/locations", handlers.GetLocationsHandler(database))
	mux.HandleFunc("/location", handlers.AddLocationHandler(database))
	mux.HandleFunc("/locationcount", handlers.GetLocationsSortedByRatingCountHandler(database))
	mux.HandleFunc("/locationrating", handlers.GetLocationsSortedByAverageRatingHandler(database))
	mux.HandleFunc("/comment", handlers.AddCommentHandler(database))
	mux.HandleFunc("/comments", handlers.GetCommentsHandler(database))
	mux.HandleFunc("/rating", handlers.AddRatingHandler(database))
	mux.HandleFunc("/addlocationpost", handlers.AddLocationAndPostHandler(database, apikey))

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
