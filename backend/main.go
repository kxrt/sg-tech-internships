package main

import (
	"database/sql"
	"log"
	"net/http"

	database "backend/database"
	"backend/handlers"

	"github.com/gin-gonic/gin"
	"github.com/mileusna/crontab"
)

func main() {
	// initialise database connection
	db, err := database.InitialiseConnection()
	database.SyncDBWithGitHub(db)

	// check for errors
	if err != nil {
		log.Fatal(err)
	}

	// close database connection
	defer db.Close()

	// repeat job at 10pm everyday
	ctab := crontab.New()
	ctab.MustAddJob("0 22 * * 0-5", func() { database.SyncDBWithGitHub(db) })

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
