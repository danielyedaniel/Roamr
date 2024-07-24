package models

import (
	"time"
)

type User struct {
	UserID         uint      `gorm:"primaryKey;autoIncrement"`
	Email          string    `gorm:"uniqueIndex;not null"`
	Username       string    `gorm:"uniqueIndex;not null"`
	PasswordHash   string    `gorm:"not null"`
	ProfilePicture string    `gorm:"not null"`
	FirstName      string    `gorm:"not null"`
	LastName       string    `gorm:"not null"`
	DateCreated    time.Time `gorm:"not null;default:CURRENT_TIMESTAMP"`
}

type Follow struct {
	FollowerID uint `gorm:"primaryKey"`
	FollowedID uint `gorm:"primaryKey"`
}

type Location struct {
	LocationID uint    `gorm:"primaryKey;autoIncrement"`
	Country    string  `gorm:"not null"`
	City       string  `gorm:"not null"`
	Latitude   float64 `gorm:"not null"`
	Longitude  float64 `gorm:"not null"`
}

type Post struct {
	PostID        uint   `gorm:"primaryKey;autoIncrement"`
	UserID        uint   `gorm:"not null"`
	Description   string `gorm:"not null"`
	CommentsCount int    `gorm:"not null"`
	Image         string `gorm:"not null"`
	LocationID    uint   `gorm:"not null"`
}

type Comment struct {
	CommentID uint   `gorm:"primaryKey;autoIncrement"`
	PostID    uint   `gorm:"not null"`
	UserID    uint   `gorm:"not null"`
	Content   string `gorm:"not null"`
}

type Rating struct {
	UserID     uint `gorm:"primaryKey"`
	LocationID uint `gorm:"primaryKey"`
	Rating     int  `gorm:"not null"`
}

