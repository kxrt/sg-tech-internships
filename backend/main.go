package main

import (
	"context"
	"database/sql"
	"log"
	"net/http"
	"strings"

	database "backend/database"
	"backend/handlers"

	firebase "firebase.google.com/go/v4"
	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
	"github.com/mileusna/crontab"
)

func main() {
	// initialise database connection
	db, err := database.InitialiseConnection()

	// check for errors
	if err != nil {
		log.Fatal(err)
	}
	database.SyncDBWithGitHub(db)

	// close database connection
	defer db.Close()

	// repeat job at 10pm everyday
	ctab := crontab.New()
	ctab.MustAddJob("0 22 * * 0-5", func() { database.SyncDBWithGitHub(db) })

	// create Firebase app
	app, _ := firebase.NewApp(context.Background(), nil)
	ctx := context.Background()
	client, err := app.Auth(ctx)
	if err != nil {
		log.Fatalf("error initializing Firebase app: %v\n", err)
	}

	r := setupRouter(db, client)
	r.Run(":8000")
}

func setupRouter(db *sql.DB, client *auth.Client) *gin.Engine {
	r := gin.Default()
	api := r.Group("/api")

	// health check
	api.GET("/ping", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	// get table data
	api.GET("/internships", func(ctx *gin.Context) {
		handlers.GetInternships(ctx, db)
	})

	// post internship role
	api.POST("/internships", handlers.PostInternship)

	// user group
	user := api.Group("/user")

	// Firebase middleware
	user.Use(func(c *gin.Context) {
		// get token from header
		idToken := c.GetHeader("Authorization")

		// split token
		idToken = strings.Split(idToken, " ")[1]

		// verify token
		token, err := handlers.VerifyToken(client, idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
			c.Abort()
			return
		}

		// set uid in context
		c.Set("token", token)
		c.Next()
	})

	// verify token with middleware and get data from db handler
	user.POST("/login", func(c *gin.Context) {
		handlers.Login(c, db)
	})

	// verify token with middleware and update data in db
	user.POST("/update", func(c *gin.Context) {
		handlers.Update(c, db)
	})

	return r
}
