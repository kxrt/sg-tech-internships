package handlers

import (
	db "backend/database"
	"backend/models"
	"bytes"
	"database/sql"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
)

func GetInternships(c *gin.Context, database *sql.DB) {
	// get internships from database
	internships, err := db.GetInternshipsFromDB(database)
	if err != nil {
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

	c.JSON(http.StatusOK, gin.H{"status": "ok"})
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
