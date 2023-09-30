package db

import (
	"backend/models"
	"backend/utils"
	"database/sql"
	"log"
	"os"

	"firebase.google.com/go/v4/auth"
	_ "github.com/lib/pq"
)

func InitialiseConnection() (*sql.DB, error) {
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
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
	defer rows.Close()

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
	// query database - company, role, summer to indicate unique internship
	// TODO - optimise, don't need one query for each internship
	stmt, err := db.Prepare("SELECT * FROM internships WHERE company=$1 AND role=$2 AND is_summer=$3")
	if err != nil {
		return false, err
	}

	// execute prepared statement
	rows, err := stmt.Query(internship.Company, internship.Role, internship.IsSummer)
	if err != nil {
		return false, err
	}

	defer rows.Close()

	// check if rows exist
	if rows.Next() {
		return true, nil
	}

	// return false
	return false, nil
}

func GetUserFromDB(db *sql.DB, token *auth.Token) (*models.User, error) {
	// number of rows
	var count int
	err := db.QueryRow("SELECT COUNT(*) FROM applications WHERE user_id = $1", token.UID).Scan(&count)

	// if error or no user found, create new user and return
	if err != nil {
		return nil, err
	} else if count == 0 {
		// create user
		stmt, err := db.Prepare("INSERT INTO users (user_id, email) VALUES ($1, $2) ON CONFLICT (user_id) DO NOTHING")
		if err != nil {
			return nil, err
		}
		defer stmt.Close()

		// execute prepared statement
		_, err = stmt.Exec(token.UID, token.Claims["email"])

		// return error if error
		if err != nil {
			return nil, err
		}
	}

	// query database to check if user exists
	stmt, err := db.Prepare("SELECT internship_id, ARRAY_AGG(status) AS statuses FROM applications WHERE user_id = $1 GROUP BY user_id, internship_id")
	if err != nil {
		log.Println(err)
		return nil, err
	}

	// execute prepared statement
	rows, err := stmt.Query(token.UID)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	// close rows
	defer rows.Close()

	// create user object
	var user models.User
	user.ID = token.UID
	user.Statuses = make(map[int][]models.Status)

	// iterate over rows
	for rows.Next() {
		// scan row into user object
		var internshipID int
		var statusesString string
		err = rows.Scan(&internshipID, &statusesString)

		if err != nil {
			return nil, err
		}

		// convert statuses to slice
		statuses, err := utils.ConvertStatusStringToArray(statusesString)
		if err != nil {
			return nil, err
		}

		// add internshipID and status to user
		user.Statuses[internshipID] = statuses
	}

	// return user
	log.Printf("User %+v fetched details\n", user.ID)
	return &user, nil
}

func UpdateUser(db *sql.DB, token *auth.Token, ur models.UpdateRequest) error {
	log.Printf("User %+v updated statuses %+v for internship %+v\n", token.UID, ur.Statuses, ur.InternshipID)
	// start transaction
	tx, err := db.Begin()
	if err != nil {
		log.Println(err)
		return err
	}

	// defer rollback
	defer tx.Rollback()

	// delete all statuses for user
	stmt, err := tx.Prepare("DELETE FROM applications WHERE user_id = $1 AND internship_id = $2")
	if err != nil {
		log.Println(err)
		return err
	}
	defer stmt.Close()

	// execute prepared statement
	_, err = stmt.Exec(token.UID, ur.InternshipID)
	if err != nil {
		return err
	}

	// insert new statuses
	stmt, err = tx.Prepare("INSERT INTO applications (user_id, internship_id, status) VALUES ($1, $2, $3) ON CONFLICT (user_id, internship_id, status) DO NOTHING")
	if err != nil {
		log.Println(err)
		return err
	}

	// execute prepared statement
	for _, Status := range ur.Statuses {
		_, err = stmt.Exec(token.UID, ur.InternshipID, Status)
		if err != nil {
			log.Println(err)
			return err
		}
	}

	// commit transaction
	err = tx.Commit()
	if err != nil {
		log.Println(err)
		return err
	}

	// return nil
	return nil
}
