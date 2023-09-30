package utils

import (
	"backend/models"
	"strings"
)

func ConvertStatusStringToArray(s string) ([]models.Status, error) {
	// split string into array
	statusArray := strings.Split(s, ",")

	// remove { and }
	statusArray[0] = strings.TrimPrefix(statusArray[0], "{")
	statusArray[len(statusArray)-1] = strings.TrimSuffix(statusArray[len(statusArray)-1], "}")

	// create array of Status objects
	statusObjectArray := make([]models.Status, len(statusArray))

	// convert strings to Status objects and trim spaces
	for i := range statusArray {
		statusObjectArray[i] = models.Status(strings.TrimSpace(statusArray[i]))
	}

	// return array
	return statusObjectArray, nil
}
