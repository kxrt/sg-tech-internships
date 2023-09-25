package utils

import (
	"errors"
	"io"
	"log"
	"net/http"
	"regexp"
	"strings"

	"backend/models"
)

// fetch data from github
func FetchData() (string, error) {
	url := "https://raw.githubusercontent.com/kxrt/Singapore-Summer2024-TechInternships/main/README.md"

	res, err := http.Get(url)
	if err != nil {
		return "", err
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		return "", err
	}

	return string(body), nil
}

// extract table data from markdown
func ExtractTables(data string) ([]models.Internship, []models.Internship, error) {
	tableRegex := regexp.MustCompile(`\|([\s\S]*?)\|\n`)
	rows := tableRegex.FindAllStringSubmatch(data, -1)

	var summer, offcycle []models.Internship
	isSummer := true

	for _, row := range rows {
		// check for invalid regex parsing
		if len(row) != 2 {
			return nil, nil, errors.New("Invalid regex parsing")
		}

		// skip header rows
		if strings.Contains(row[1], "Date Added") || strings.Contains(row[1], ":---") {
			if len(summer) > 0 {
				isSummer = false
			}
			continue
		}

		data := strings.Split(row[1], " | ")

		// check for invalid data
		if len(data) != 4 {
			return nil, nil, errors.New("invalid data")
		}

		// application links are in the form [Open](link)
		link := strings.TrimSuffix(strings.TrimPrefix(strings.TrimSpace(data[2]), "[Open]("), ")")

		// create internship object
		internship := models.Internship{
			Company:   strings.TrimSpace(data[0]),
			Role:      strings.ReplaceAll(strings.TrimSpace(data[1]), "\\", ""),
			Link:      link,
			DateAdded: strings.TrimSpace(data[3]),
			IsSummer:  isSummer,
		}

		if isSummer {
			summer = append(summer, internship)
		} else {
			offcycle = append(offcycle, internship)
		}
	}

	return summer, offcycle, nil
}

func GetInternshipsFromGitHub() (map[string][]models.Internship, error) {
	// fetch data from github
	data, err := FetchData()
	if err != nil {
		log.Default().Println(err)
		return nil, errors.New("data fetch failed")
	}

	// extract table data from markdown
	summer, offcycle, err := ExtractTables(data)
	if err != nil {
		log.Default().Println(err)
		return nil, errors.New("data extraction failed")
	}

	// return data
	return map[string][]models.Internship{
		"summer":   summer,
		"offcycle": offcycle}, nil

}
