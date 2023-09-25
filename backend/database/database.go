package db

import (
	"backend/models"
	"backend/utils"
	"database/sql"
	"log"
	"os"

	_ "github.com/lib/pq"
)

func InitialiseConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL")+"?sslmode=disable")
	if err != nil {
		return nil, err
	}
	return db, nil
}

// GetInternships returns all internships from the database
func GetInternshipsFromDB(db *sql.DB) (map[string][]models.Internship, error) {
	// query database
	rows, err := db.Query("SELECT * FROM internships")
	if err != nil {
		return nil, err
	}

	// create map to store internships
	internships := map[string][]models.Internship{
		"summer":   {},
		"offcycle": {},
	}

	// iterate over rows
	for rows.Next() {
		// create internship object
		var internship models.Internship

		// scan row into internship object
		err := rows.Scan(&internship.ID, &internship.Company, &internship.Role, &internship.Link, &internship.DateAdded, &internship.IsSummer)
		if err != nil {
			return nil, err
		}

		// format date to dd mmm yyyy
		formattedDate, err := utils.FormatDate(internship.DateAdded)
		if err != nil {
			log.Println(err)
			return nil, err
		}
		internship.DateAdded = formattedDate

		// append internship to slice depending on season
		if internship.IsSummer {
			internships["summer"] = append(internships["summer"], internship)
		} else {
			internships["offcycle"] = append(internships["offcycle"], internship)
		}
	}

	// return slice
	return internships, nil
}

// CreateInternship creates a new internship in the database
func CreateInternship(db *sql.DB, internship models.Internship) error {
	// insert into database prepared statement
	stmt, err := db.Prepare("INSERT INTO internships (company, role, link, date_added, is_summer) VALUES ($1, $2, $3, $4, $5)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	// execute prepared statement
	_, err = stmt.Exec(internship.Company, internship.Role, internship.Link, internship.DateAdded, internship.IsSummer)
	if err != nil {
		return err
	}

	// return nil
	return nil
}

// SyncDBWithGitHub syncs the database with the GitHub markdown file
func SyncDBWithGitHub(db *sql.DB) error {
	internships, err := utils.GetInternshipsFromGitHub()

	if err != nil {
		return err
	}

	// for each internship, check if company and role are in db
	for _, internship := range internships["summer"] {
		// check if internship exists
		exists, err := checkInternshipExists(db, internship)
		if err != nil {
			return err
		}

		// if internship does not exist, create it
		if !exists {
			err := CreateInternship(db, internship)
			if err != nil {
				return err
			}
		}
	}

	for _, internship := range internships["offcycle"] {
		// check if internship exists
		exists, err := checkInternshipExists(db, internship)
		if err != nil {
			return err
		}

		// if internship does not exist, create it
		if !exists {
			err := CreateInternship(db, internship)
			if err != nil {
				return err
			}
		}
	}

	return nil
}

// checkInternshipExists checks if an internship exists in the database
func checkInternshipExists(db *sql.DB, internship models.Internship) (bool, error) {
	// query database
	rows, err := db.Query("SELECT * FROM internships WHERE company=$1 AND role=$2 AND is_summer=$3", internship.Company, internship.Role, internship.IsSummer)
	if err != nil {
		return false, err
	}

	// check if rows exist
	if rows.Next() {
		return true, nil
	}

	// return false
	return false, nil
}
