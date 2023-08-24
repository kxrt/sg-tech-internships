package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
)

func main() {
	// load env variables
	err := godotenv.Load()
	if err != nil {
		log.Fatal("Error loading .env file")
	}

	r := setupRouter()
	r.Run(":8000")
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	// health check
	r.GET("/api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// get table data
	r.GET("/api/internships", getInternships)

	// post internship role
	r.POST("/api/internships", postInternship)

	return r
}
