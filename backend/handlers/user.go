package handlers

import (
    "backend/models"
    "encoding/json"
    "fmt"
    "gorm.io/gorm"
    "net/http"
    "golang.org/x/crypto/bcrypt"
)

type Credentials struct {
    Username string `json:"username"`
    Password string `json:"password"`
    Email    string `json:"email"`
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
            Username: creds.Username,
            Password: string(hashedPassword),
            Email:    creds.Email,
        }

        if err := db.Create(&user).Error; err != nil {
            http.Error(w, "Error saving user to database", http.StatusInternalServerError)
            return
        }

        w.WriteHeader(http.StatusCreated)
        fmt.Fprintf(w, "User created successfully")
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

        if err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(creds.Password)); err != nil {
            http.Error(w, "Invalid username or password", http.StatusUnauthorized)
            return
        }

        w.WriteHeader(http.StatusOK)
        fmt.Fprintf(w, "Login successful")
    }
}
