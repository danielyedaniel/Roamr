package models

import (
    "gorm.io/gorm"
    "time"
)

type User struct {
    UserID         uint           `gorm:"primaryKey"`
    Email          string         `gorm:"uniqueIndex;not null"`
    Username       string         `gorm:"uniqueIndex;not null"`
    PasswordHash   string         `gorm:"not null"`
    ProfilePicture string         `gorm:"size:255"`
    FirstName      string         `gorm:"size:255"`
    LastName       string         `gorm:"size:255"`
    DateCreated    time.Time      `gorm:"type:timestamptz"`
    gorm.Model
}

type Post struct {
    PostID        uint           `gorm:"primaryKey"`
    UserID        uint           `gorm:"not null"`
    LocationID    uint           `gorm:"not null"`
    Description   string         `gorm:"type:text"`
    CommentsCount int            `gorm:"not null"`
    Image         string         `gorm:"size:255"`
    Comments      []Comment      `gorm:"foreignKey:PostID"`
    gorm.Model
}

type Location struct {
    LocationID uint    `gorm:"primaryKey"`
    Latitude   float64 `gorm:"not null"`
    Longitude  float64 `gorm:"not null"`
    Country    string  `gorm:"size:255"`
    City       string  `gorm:"size:255"`
    Posts      []Post  `gorm:"foreignKey:LocationID"`
    Reviews    []Review `gorm:"foreignKey:LocationID"`
    gorm.Model
}

type Comment struct {
    CommentID uint   `gorm:"primaryKey"`
    PostID    uint   `gorm:"not null"`
    UserID    uint   `gorm:"not null"`
    Content   string `gorm:"type:text"`
    gorm.Model
}

type Follow struct {
    FollowerID uint `gorm:"primaryKey"`
    FollowedID uint `gorm:"primaryKey"`
    gorm.Model
}

type Review struct {
    ReviewID          uint   `gorm:"primaryKey"`
    LocationID        uint   `gorm:"not null"`
    ReviewDescription string `gorm:"type:text"`
    ReviewRating      int    `gorm:"not null"`
    gorm.Model
}
