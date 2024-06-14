package models

import "gorm.io/gorm"

type User struct {
    ID       uint   `gorm:"primaryKey"`
    Username string `gorm:"uniqueIndex;not null"`
    Password string `gorm:"not null"`
    Email    string `gorm:"uniqueIndex;not null"`
    gorm.Model
}
