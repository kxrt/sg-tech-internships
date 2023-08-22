package main

import (
	"log"
	"net/http"

	"github.com/gin-gonic/gin"
)

func main() {
	r := setupRouter()
	r.Run(":8080")
}

func setupRouter() *gin.Engine {
	r := gin.Default()

	// health check
	r.GET("/api/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// get table data
	r.GET("/api/internships", internships)

	return r
}

func internships(c *gin.Context) {
	data, err := fetchData()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Data fetch failed"})
		return
	}

	summer, offcycle, err := extractTables(data)
	if err != nil {
		log.Default().Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Data extraction failed"})
		return
	}

	c.JSON(http.StatusOK,
		gin.H{"data": map[string][]Internship{
			"summer":   summer,
			"offcycle": offcycle},
		},
	)
}
