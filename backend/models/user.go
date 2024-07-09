package models

import (
	"time"
)

type User struct {
	UserID         uint      `gorm:"primaryKey;column:userID;autoIncrement"`
	Email          string    `gorm:"uniqueIndex;not null;column:email"`
	Username       string    `gorm:"uniqueIndex;not null;column:username"`
	PasswordHash   string    `gorm:"not null;column:passwordHash"`
	ProfilePicture string    `gorm:"not null;column:profilePicture"`
	FirstName      string    `gorm:"not null;column:firstName"`
	LastName       string    `gorm:"not null;column:lastName"`
	DateCreated    time.Time `gorm:"not null;default:CURRENT_TIMESTAMP;column:dateCreated"`
}

func (User) TableName() string {
	return "User"
}

type Follow struct {
	FollowerID uint `gorm:"primaryKey;column:followerID"`
	FollowedID uint `gorm:"primaryKey;column:followedID"`
}

func (Follow) TableName() string {
	return "Follow"
}

type Location struct {
	LocationID uint    `gorm:"primaryKey;column:locationID;autoIncrement"`
	Country    string  `gorm:"column:country"`
	City       string  `gorm:"column:city"`
	Latitude   float64 `gorm:"not null;column:latitude"`
	Longitude  float64 `gorm:"not null;column:longitude"`
}

func (Location) TableName() string {
	return "Location"
}

type Post struct {
	PostID        uint   `gorm:"primaryKey;column:postID;autoIncrement"`
	UserID        uint   `gorm:"not null;column:userID"`
	Description   string `gorm:"not null;column:description"`
	CommentsCount int    `gorm:"not null;column:commentsCount"`
	Image         string `gorm:"not null;column:image"`
	LocationID    uint   `gorm:"column:locationID"`
}

func (Post) TableName() string {
	return "Post"
}

type Comment struct {
	CommentID uint   `gorm:"primaryKey;column:commentID;autoIncrement"`
	PostID    uint   `gorm:"not null;column:postID"`
	UserID    uint   `gorm:"not null;column:userID"`
	Content   string `gorm:"not null;column:content"`
}

func (Comment) TableName() string {
	return "Comment"
}

type Rating struct {
	UserID     uint `gorm:"primaryKey;column:userID"`
	LocationID uint `gorm:"primaryKey;column:locationID"`
	Rating     int  `gorm:"not null;column:rating"`
}

func (Rating) TableName() string {
	return "Rating"
}
