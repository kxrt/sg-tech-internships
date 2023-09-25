package main

import (
	"database/sql"
	"log"
	"net/http"

	db "backend/database"
	"backend/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
	// initialise database connection
	db, err := db.InitialiseConnection()

	// check for errors
	if err != nil {
		log.Fatal(err)
	}

	// close database connection
	defer db.Close()

	r := setupRouter(db)
	r.Run(":8000")
}

func setupRouter(db *sql.DB) *gin.Engine {
	r := gin.Default()

	// health check
	r.GET("/api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// get table data
	r.GET("/api/internships", func(ctx *gin.Context) {
		handlers.GetInternships(ctx, db)
	})

	// post internship role
	r.POST("/api/internships", handlers.PostInternship)

	return r
}
