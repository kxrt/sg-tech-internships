package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := setupRouter()
	r.Run(":8080")
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	// auth middleware
	// authorized := r.Group("/api", gin.BasicAuth(gin.Accounts{
	// 	os.Getenv("key"): os.Getenv("secret"),
	// }))

	// health check
	r.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// get table data
	r.GET("/internships", func(c *gin.Context) {
		// TODO: parse md data
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	return r
}
