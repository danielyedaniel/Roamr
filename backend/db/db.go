package db

import (
    "backend/config"
    "backend/models"
    "fmt"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

func Initialize(cfg *config.Config) (*gorm.DB, error) {
    dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=UTC",
        cfg.DBHost, cfg.DBUser, cfg.DBPassword, cfg.DBName, cfg.DBPort)
    db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
    if err != nil {
        return nil, fmt.Errorf("error opening database: %w", err)
    }

    err = db.AutoMigrate(&models.User{})
    if err != nil {
        return nil, fmt.Errorf("error migrating database: %w", err)
    }

    fmt.Println("Successfully connected to PostgreSQL with GORM!")
    return db, nil
}

func CloseDB(db *gorm.DB) error {
    sqlDB, err := db.DB()
    if err != nil {
        return fmt.Errorf("error getting database: %w", err)
    }
    return sqlDB.Close()
}
