package main

import (
	"errors"
	"io"
	"net/http"
	"regexp"
	"strings"
)

// curl data from github
func fetchData() (string, error) {
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
func extractTables(data string) ([]Internship, []Internship, error) {
	tableRegex := regexp.MustCompile(`\|([\s\S]*?)\|\n`)
	rows := tableRegex.FindAllStringSubmatch(data, -1)

	var summer, offcycle []Internship
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
			return nil, nil, errors.New("Invalid data")
		}

		// application links are in the form [Open](link)
		link := strings.TrimSuffix(strings.TrimPrefix(strings.TrimSpace(data[2]), "[Open]("), ")")

		internship := Internship{
			Company:   strings.TrimSpace(data[0]),
			Role:      strings.ReplaceAll(strings.TrimSpace(data[1]), "\\", ""),
			Link:      link,
			DateAdded: strings.TrimSpace(data[3]),
		}

		if isSummer {
			summer = append(summer, internship)
		} else {
			offcycle = append(offcycle, internship)
		}
	}

	return summer, offcycle, nil
}
