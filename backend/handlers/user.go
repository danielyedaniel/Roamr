package handlers

import (
    "backend/models"
    "encoding/json"
    "fmt"
    "gorm.io/gorm"
    "net/http"
    "golang.org/x/crypto/bcrypt"
    "time"
    "strconv"
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
	PostID        uint      `json:"postID"`
	UserID        uint      `json:"userID"`
	Description   string    `json:"description"`
	CommentsCount int       `json:"commentsCount"`
	Image         string    `json:"image"`
	LocationID    uint      `json:"locationID"`
	CreatedAt     time.Time `json:"createdAt"`
	UpdatedAt     time.Time `json:"updatedAt"`
}

type UserResponse struct {
	UserID         uint      `json:"userID"`
	Username       string    `json:"username"`
	Email          string    `json:"email"`
	ProfilePicture string    `json:"profilePicture"`
	FirstName      string    `json:"firstName"`
	LastName       string    `json:"lastName"`
	DateCreated    time.Time `json:"dateCreated"`
	Token          string    `json:"token,omitempty"`
}

type LocationSearchRequest struct {
	City       string `json:"city"`
	LocationID uint   `json:"locationId"`
	Country    string `json:"country"`
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
        userIDStr := r.URL.Query().Get("userID")
        userID, err := strconv.Atoi(userIDStr)
        if err != nil {
            http.Error(w, "Invalid userID", http.StatusBadRequest)
            return
        }

        var posts []models.Post
        if err := db.Where("Post.userID = ?", userID).Find(&posts).Error; err != nil {
            http.Error(w, fmt.Sprintf("Error querying database, %v", err), http.StatusInternalServerError)
            return
        }

        w.Header().Set("Content-Type", "application/json")
        if err := json.NewEncoder(w).Encode(posts); err != nil {
            http.Error(w, "Error encoding response", http.StatusInternalServerError)
        }
    }
}