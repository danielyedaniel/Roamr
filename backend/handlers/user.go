package handlers

import (
	"backend/models"
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
	"time"

	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

type Credentials struct {
	Username       string `json:"username"`
	Password       string `json:"password"`
	Email          string `json:"email"`
	ProfilePicture string `json:"profile_picture"`
	FirstName      string `json:"first_name"`
	LastName       string `json:"last_name"`
}

type SearchRequest struct {
	Username string `json:"username"`
}

type PostRequest struct {
	UserID      uint   `json:"user_id"`
	Description string `json:"description"`
	Image       string `json:"image"`
	LocationID  uint   `json:"location_id,omitempty"`
}

type PostResponse struct {
	PostID        uint      `json:"post_id"`
	UserID        uint      `json:"user_id"`
	Description   string    `json:"description"`
	CommentsCount int       `json:"comments_count"`
	Image         string    `json:"image"`
	LocationID    uint      `json:"location_id"`
	CreatedAt     time.Time `json:"created_at"`
	UpdatedAt     time.Time `json:"updated_at"`
}

type UserResponse struct {
	UserID         uint      `json:"user_id"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	ProfilePicture string    `json:"profile_picture"`
	FirstName      string    `json:"first_name"`
	LastName       string    `json:"last_name"`
	DateCreated    time.Time `json:"date_created"`
	Token          string    `json:"token,omitempty"`
}

type LocationSearchRequest struct {
	City       string `json:"city"`
	LocationID uint   `json:"location_id"`
	Country    string `json:"country"`
}

type FollowRequest struct {
	FollowerID uint `json:"followerID"`
	FollowedID uint `json:"followedID"`
}

type RatingRequest struct {
	UserID     uint `json:"user_id"`
	LocationID uint `json:"location_id"`
	Rating     int  `json:"rating"`
}

type CommentResponse struct {
	CommentID   uint      `json:"comment_id"`
	PostID      uint      `json:"post_id"`
	UserID      uint      `json:"user_id"`
	Content     string    `json:"content"`
	DateCreated time.Time `json:"date_created"`
}

type LocationAndPostRequest struct {
	Description string  `json:"description"`
	Longitude   float64 `json:"longitude"`
	Latitude    float64 `json:"latitude"`
	UserID      uint    `json:"user_id"`
	Image       string  `json:"image"`
}

func FollowHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var followReq FollowRequest
		if err := json.NewDecoder(r.Body).Decode(&followReq); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if followReq.FollowerID == followReq.FollowedID {
			http.Error(w, "Follower and followed IDs cannot be the same", http.StatusBadRequest)
			return
		}

		follow := models.Follow{
			FollowerID: followReq.FollowerID,
			FollowedID: followReq.FollowedID,
		}

		if err := db.Create(&follow).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error saving follow to database, %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Follow created successfully")
	}
}

func UnfollowHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var followReq FollowRequest
		if err := json.NewDecoder(r.Body).Decode(&followReq); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		if err := db.Where("follower_id = ? AND followed_id = ?", followReq.FollowerID, followReq.FollowedID).
			Delete(&models.Follow{}).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error deleting follow from database, %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Unfollowed successfully")
	}
}

func SignupHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var creds Credentials
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		hashedPassword, err := bcrypt.GenerateFromPassword([]byte(creds.Password), bcrypt.DefaultCost)
		if err != nil {
			http.Error(w, "Error hashing password", http.StatusInternalServerError)
			return
		}

		user := models.User{
			Username:       creds.Username,
			PasswordHash:   string(hashedPassword),
			Email:          creds.Email,
			ProfilePicture: creds.ProfilePicture,
			FirstName:      creds.FirstName,
			LastName:       creds.LastName,
			DateCreated:    time.Now(),
		}

		if err := db.Create(&user).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error saving user to database, %v", err), http.StatusInternalServerError)
			return
		}

		userResponse := UserResponse{
			UserID:         user.UserID,
			Username:       user.Username,
			Email:          user.Email,
			ProfilePicture: user.ProfilePicture,
			FirstName:      user.FirstName,
			LastName:       user.LastName,
			DateCreated:    user.DateCreated,
		}

		w.WriteHeader(http.StatusCreated)
		if err := json.NewEncoder(w).Encode(userResponse); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func LoginHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var creds Credentials
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		var user models.User
		if err := db.Where("username = ?", creds.Username).First(&user).Error; err != nil {
			if err == gorm.ErrRecordNotFound {
				http.Error(w, "Invalid username or password", http.StatusUnauthorized)
				return
			}
			http.Error(w, "Error querying database", http.StatusInternalServerError)
			return
		}

		if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(creds.Password)); err != nil {
			http.Error(w, "Invalid username or password", http.StatusUnauthorized)
			return
		}

		token := "dummy-token"
		userResponse := UserResponse{
			UserID:         user.UserID,
			Username:       user.Username,
			Email:          user.Email,
			ProfilePicture: user.ProfilePicture,
			FirstName:      user.FirstName,
			LastName:       user.LastName,
			DateCreated:    user.DateCreated,
			Token:          token,
		}

		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(userResponse); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func SearchHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var searchReq SearchRequest
		if err := json.NewDecoder(r.Body).Decode(&searchReq); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		var users []models.User
		if err := db.Where("username LIKE ?", "%"+searchReq.Username+"%").Find(&users).Error; err != nil {
			http.Error(w, "Error querying database", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(users); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func LocationSearchHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var searchReq LocationSearchRequest
		var locations []models.Location

		if err := json.NewDecoder(r.Body).Decode(&searchReq); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		query := db

		if searchReq.LocationID != 0 {
			query = query.Where("location_id = ?", searchReq.LocationID)
		}

		if searchReq.City != "" && searchReq.Country != "" {
			query = query.Where("city = ? AND country = ?", searchReq.City, searchReq.Country)
		}

		if err := query.Find(&locations).Error; err != nil {
			http.Error(w, "Error querying database", http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(locations); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func PostHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var postReq PostRequest
		decoder := json.NewDecoder(r.Body)
		if err := decoder.Decode(&postReq); err != nil {
			http.Error(w, fmt.Sprintf("Invalid request payload: %v", err), http.StatusBadRequest)
			return
		}

		post := models.Post{
			UserID:        postReq.UserID,
			Description:   postReq.Description,
			CommentsCount: 0,
			Image:         postReq.Image,
			LocationID:    postReq.LocationID,
		}

		if err := db.Create(&post).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error saving post to database %v, %v", err, post.LocationID), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Post created successfully")
	}
}

func GetPostsByUserHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := r.URL.Query().Get("user_id")
		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			http.Error(w, "Invalid user_id", http.StatusBadRequest)
			return
		}

		var posts []struct {
			models.Post
			City    string `json:"city"`
			Country string `json:"country"`
		}

		query := `
            SELECT p.*, l.city, l.country
            FROM posts p
            LEFT JOIN locations l ON p.location_id = l.location_id
            WHERE p.user_id = ?
            ORDER BY p.date_created DESC;
        `

		if err := db.Raw(query, userID).Scan(&posts).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error querying database, %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(posts); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func DeletePostHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postIDStr := r.URL.Query().Get("postID")
		if postIDStr == "" {
			http.Error(w, "postID is required", http.StatusBadRequest)
			return
		}

		postID, err := strconv.Atoi(postIDStr)
		if err != nil {
			http.Error(w, "Invalid postID", http.StatusBadRequest)
			return
		}

		if err := db.Delete(&models.Post{}, postID).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error deleting post from database, %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusOK)
		fmt.Fprintf(w, "Post deleted successfully")
	}
}
func GetLocationsAndPostsByUserAndFollowingHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		userIDStr := r.URL.Query().Get("user_id")
		userID, err := strconv.Atoi(userIDStr)
		if err != nil {
			http.Error(w, "Invalid user_id", http.StatusBadRequest)
			return
		}

		type Post struct {
			PostID        uint   `json:"post_id"`
			UserID        uint   `json:"user_id"`
			Username      string `json:"username"`
			Description   string `json:"description"`
			CommentsCount int    `json:"comments_count"`
			Image         string `json:"image"`
			LocationID    uint   `json:"location_id"`
		}

		type LocationWithPosts struct {
			LocationID uint    `json:"location_id"`
			City       string  `json:"city"`
			Country    string  `json:"country"`
			Longitude  float64 `json:"longitude"`
			Latitude   float64 `json:"latitude"`
			Posts      []Post  `json:"posts"`
		}

		var locationWithPosts []LocationWithPosts

		query := `
			SELECT p.post_id, p.user_id, u.username, p.description, p.comments_count, p.image, p.location_id, 
			       l.location_id, l.city, l.country, l.longitude, l.latitude
			FROM posts p
			LEFT JOIN locations l ON p.location_id = l.location_id
			LEFT JOIN users u ON p.user_id = u.user_id
			WHERE (p.user_id = ? OR p.user_id IN (
				SELECT followed_id
				FROM follows
				WHERE follower_id = ?
			)) AND l.location_id IS NOT NULL
		`

		rows, err := db.Raw(query, userID, userID).Rows()
		if err != nil {
			http.Error(w, fmt.Sprintf("Error querying database: %v", err), http.StatusInternalServerError)
			return
		}
		defer rows.Close()

		locationMap := make(map[uint]*LocationWithPosts)
		for rows.Next() {
			var post Post
			var locationID uint
			var city, country, username string
			var longitude, latitude float64

			if err := rows.Scan(&post.PostID, &post.UserID, &username, &post.Description, &post.CommentsCount, &post.Image, &post.LocationID, &locationID, &city, &country, &longitude, &latitude); err != nil {
				http.Error(w, fmt.Sprintf("Error scanning row: %v", err), http.StatusInternalServerError)
				return
			}
			post.Username = username
			if _, exists := locationMap[locationID]; !exists {
				locationMap[locationID] = &LocationWithPosts{
					LocationID: locationID,
					City:       city,
					Country:    country,
					Longitude:  longitude,
					Latitude:   latitude,
					Posts:      []Post{},
				}
			}
			locationMap[locationID].Posts = append(locationMap[locationID].Posts, post)
		}

		for _, loc := range locationMap {
			locationWithPosts = append(locationWithPosts, *loc)
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(locationWithPosts); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}


func AddRatingHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var ratingReq RatingRequest
		if err := json.NewDecoder(r.Body).Decode(&ratingReq); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		rating := models.Rating{
			UserID:     ratingReq.UserID,
			LocationID: ratingReq.LocationID,
			Rating:     ratingReq.Rating,
		}

		if err := db.Create(&rating).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error saving rating to database: %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Rating added successfully")
	}
}

func GetLocationsHandler(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var locations []struct {
            LocationID uint    `json:"location_id"`
            Country    string  `json:"country"`
            City       string  `json:"city"`
            Latitude   float64 `json:"latitude"`
            Longitude  float64 `json:"longitude"`
        }

        query := `
            SELECT location_id, country, city, latitude, longitude
            FROM locations;
        `

        if err := db.Raw(query).Scan(&locations).Error; err != nil {
            http.Error(w, fmt.Sprintf("Error querying database: %v", err), http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        if err := json.NewEncoder(w).Encode(locations); err != nil {
            http.Error(w, "Error encoding response", http.StatusInternalServerError)
        }
    }
}


func AddLocationHandler(db *gorm.DB) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var location models.Location
        err := json.NewDecoder(r.Body).Decode(&location)
        if err != nil {
            http.Error(w, fmt.Sprintf("Invalid input: %v", err), http.StatusBadRequest)
            return
        }

        // Log the decoded location to debug
        fmt.Printf("Decoded location: %+v\n", location)

        // Ensure required fields are provided
        if location.Country == "" || location.City == "" || location.Latitude == 0 || location.Longitude == 0 {
            http.Error(w, "Missing required fields", http.StatusBadRequest)
            return
        }

        if err := db.Create(&location).Error; err != nil {
            http.Error(w, fmt.Sprintf("Error adding location to database: %v", err), http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusCreated)
        if err := json.NewEncoder(w).Encode(location); err != nil {
            http.Error(w, "Error encoding response", http.StatusInternalServerError)
        }
    }
}


func AddCommentHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var commentReq struct {
			UserID  uint   `json:"user_id"`
			PostID  uint   `json:"post_id"`
			Content string `json:"content"`
		}

		if err := json.NewDecoder(r.Body).Decode(&commentReq); err != nil {
			http.Error(w, "Invalid request payload", http.StatusBadRequest)
			return
		}

		comment := models.Comment{
			UserID:  commentReq.UserID,
			PostID:  commentReq.PostID,
			Content: commentReq.Content,
		}

		// Create the comment
		if err := db.Create(&comment).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error saving comment to database: %v", err), http.StatusInternalServerError)
			return
		}

		w.WriteHeader(http.StatusCreated)
		fmt.Fprintf(w, "Comment added successfully")
	}
}


func GetCommentsHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		postIDStr := r.URL.Query().Get("post_id")
		postID, err := strconv.Atoi(postIDStr)
		if err != nil {
			http.Error(w, "Invalid post_id", http.StatusBadRequest)
			return
		}

		var comments []CommentResponse
		if err := db.Table("comments").
			Where("post_id = ?", postID).
			Select("comment_id, post_id, user_id, content, date_created").
			Scan(&comments).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error querying database: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(comments); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func GetLocationsSortedByRatingCountHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var locations []struct {
			models.Location
			RatingCount int `json:"rating_count"`
		}

		query := `
			SELECT l.*, COUNT(r.location_id) as rating_count
			FROM locations l
			LEFT JOIN ratings r ON l.location_id = r.location_id
			GROUP BY l.location_id
			ORDER BY rating_count DESC;
		`

		if err := db.Raw(query).Scan(&locations).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error querying database: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(locations); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func GetLocationsSortedByAverageRatingHandler(db *gorm.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var locations []struct {
			models.Location
			AverageRating float64 `json:"average_rating"`
		}

		query := `
			SELECT l.*, COALESCE(AVG(r.rating), 0) as average_rating
			FROM locations l
			LEFT JOIN ratings r ON l.location_id = r.location_id
			GROUP BY l.location_id
			ORDER BY average_rating DESC;
		`

		if err := db.Raw(query).Scan(&locations).Error; err != nil {
			http.Error(w, fmt.Sprintf("Error querying database: %v", err), http.StatusInternalServerError)
			return
		}

		w.Header().Set("Content-Type", "application/json")
		if err := json.NewEncoder(w).Encode(locations); err != nil {
			http.Error(w, "Error encoding response", http.StatusInternalServerError)
		}
	}
}

func AddLocationAndPostHandler(db *gorm.DB, apiKey string) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        var req LocationAndPostRequest
        if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
            http.Error(w, fmt.Sprintf("Invalid request payload: %v", err), http.StatusBadRequest)
            return
        }

        // Fetch location from HERE API
        locationURL := fmt.Sprintf("https://revgeocode.search.hereapi.com/v1/revgeocode?at=%f,%f&apikey=%s", req.Latitude, req.Longitude, apiKey)
        fmt.Println(locationURL)
        resp, err := http.Get(locationURL)
        if err != nil || resp.StatusCode != http.StatusOK {
            http.Error(w, fmt.Sprintf("Failed to fetch location data: %v", err), http.StatusInternalServerError)
            return
        }
        defer resp.Body.Close()

        var locationResponse struct {
            Items []struct {
                Address struct {
                    CountryName string `json:"countryName"`
                    City        string `json:"city"`
                } `json:"address"`
            } `json:"items"`
        }

        if err := json.NewDecoder(resp.Body).Decode(&locationResponse); err != nil {
            http.Error(w, fmt.Sprintf("Error decoding location data: %v", err), http.StatusInternalServerError)
            return
        }
		fmt.Println(locationResponse)

        var country, city string
        if len(locationResponse.Items) == 0 || locationResponse.Items[0].Address.CountryName == "" || locationResponse.Items[0].Address.City == "" {
            country = "ocean"
            city = "ocean"
        } else {
            country = locationResponse.Items[0].Address.CountryName
            city = locationResponse.Items[0].Address.City
        }

        // Check if location already exists
        var location models.Location
        if err := db.Where("country = ? AND city = ? AND latitude = ? AND longitude = ?", country, city, req.Latitude, req.Longitude).First(&location).Error; err != nil {
            if err == gorm.ErrRecordNotFound {
                // Create new location
                location = models.Location{
                    Country:   country,
                    City:      city,
                    Latitude:  req.Latitude,
                    Longitude: req.Longitude,
                }
                if err := db.Create(&location).Error; err != nil {
                    http.Error(w, fmt.Sprintf("Error creating location: %v", err), http.StatusInternalServerError)
                    return
                }
            } else {
                http.Error(w, fmt.Sprintf("Error querying location: %v", err), http.StatusInternalServerError)
                return
            }
        }

        // Create new post
        post := models.Post{
            UserID:        req.UserID,
            Description:   req.Description,
            CommentsCount: 0,
            Image:         req.Image,
            LocationID:    location.LocationID,
            DateCreated:   time.Now(),
        }
        if err := db.Create(&post).Error; err != nil {
            http.Error(w, fmt.Sprintf("Error creating post: %v", err), http.StatusInternalServerError)
            return
        }

        // Prepare the response
        response := struct {
            Location models.Location `json:"location"`
            Post     models.Post     `json:"post"`
        }{
            Location: location,
            Post:     post,
        }

        w.Header().Set("Content-Type", "application/json")
        w.WriteHeader(http.StatusCreated)
        if err := json.NewEncoder(w).Encode(response); err != nil {
            http.Error(w, fmt.Sprintf("Error encoding response: %v", err), http.StatusInternalServerError)
        }
    }
}
