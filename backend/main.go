package main

import (
	"net/http"

	"backend/handlers"

	"github.com/gin-gonic/gin"
)

func main() {
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
	r.GET("/api/internships", handlers.GetInternships)

	// post internship role
	r.POST("/api/internships", handlers.PostInternship)

	return r
}
