package handlers

import (
	db "backend/database"
	"backend/models"
	"bytes"
	"context"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"firebase.google.com/go/v4/auth"
	"github.com/gin-gonic/gin"
)

func GetInternships(c *gin.Context, database *sql.DB) {
	// get internships from database
	internships, err := db.GetInternshipsFromDB(database)
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Database query failed"})
		return
	}
	c.JSON(http.StatusOK, map[string]map[string][]models.Internship{"data": internships})
}

func PostInternship(c *gin.Context) {
	// parse request body
	var internship models.InternshipData
	if err := c.ShouldBindJSON(&internship); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// create a GitHub issue
	err := CreateIssue(internship)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Issue creation failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}

func CreateIssue(internship models.InternshipData) error {
	// create issue body
	body := fmt.Sprintf("> Automated submission for %s\n\n", internship.Company)
	if internship.IsSummer {
		body += "Summer\n"
	} else {
		body += "Offcycle\n"
	}
	body += fmt.Sprintf("```| %s | %s | [Open](%s) | %s |```", internship.Company, internship.Role, internship.Link, time.Now().Format("02 Jan 2006"))

	// create issue payload
	payload := map[string]string{
		"title": internship.Company,
		"body":  body,
	}
	payloadJSON, err := json.Marshal(payload)
	if err != nil {
		log.Println(err)
		return err
	}

	// post issue
	url := os.Getenv("GITHUB_API_URL")
	req, err := http.NewRequest("POST", url, bytes.NewBuffer(payloadJSON))
	if err != nil {
		log.Println(err)
		return err
	}

	// set headers
	req.Header.Set("Accept", "application/vnd.github+json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("GITHUB_API_TOKEN"))

	// send request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		log.Println(err)
		return err
	}

	res, _ := io.ReadAll(resp.Body)

	// check response
	if resp.StatusCode != http.StatusCreated {
		log.Println("Status code:", resp.StatusCode)
		log.Println("Response body:", string(res))
		return fmt.Errorf("status code: %d", resp.StatusCode)
	}
	defer resp.Body.Close()

	return nil
}

func VerifyToken(client *auth.Client, idToken string) (*auth.Token, error) {
	// check if token is valid
	ctx := context.Background()
	token, err := client.VerifyIDToken(ctx, idToken)

	// return error if invalid
	if err != nil {
		log.Printf("error verifying ID token: %v\n", err)
		return nil, err
	}

	// return token
	return token, nil
}

func Login(c *gin.Context, database *sql.DB) {
	tokenInterface, exists := c.Get("token")

	// return error if invalid
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// convert tokenInterface to *auth.Token
	token, ok := tokenInterface.(*auth.Token)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert token"})
		return
	}

	// get user from database
	user, err := db.GetUserFromDB(database, token)

	// return error if user not found
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	// return user
	marshalledUser, _ := json.Marshal(user)
	c.JSON(http.StatusOK, map[string]string{"data": string(marshalledUser)})
}

func Update(c *gin.Context, database *sql.DB) {
	tokenInterface, exists := c.Get("token")

	// return error if invalid
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid token"})
		return
	}

	// convert tokenInterface to *auth.Token
	token, ok := tokenInterface.(*auth.Token)
	if !ok {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to convert token"})
		return
	}

	// parse request body
	var ur models.UpdateRequest
	if err := c.ShouldBindJSON(&ur); err != nil {
		log.Println(err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// check if all statuses are valid
	for _, status := range ur.Statuses {
		if !status.IsValid() {
			c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid status"})
			return
		}
	}

	// update user in database
	err := db.UpdateUser(database, token, ur)

	// return error if update failed
	if err != nil {
		log.Println(err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Update failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"status": "OK"})
}
