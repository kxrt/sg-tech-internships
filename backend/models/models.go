package models

type Internship struct {
	ID        int    `json:"internship_id"`
	Company   string `json:"company"`
	Role      string `json:"role"`
	Link      string `json:"link"`
	DateAdded string `json:"date_added"`
	IsSummer  bool   `json:"is_summer"`
}

type InternshipData struct {
	Company  string `json:"company"`
	Role     string `json:"role"`
	Link     string `json:"link"`
	IsSummer bool   `json:"is_summer"`
}

type User struct {
	ID       string           `json:"user_id"`
	Statuses map[int][]Status `json:"statuses"`
}

type UpdateRequest struct {
	InternshipID int      `json:"internship_id"`
	Statuses     []Status `json:"statuses"`
}

// enum for Status
type Status string

const (
	Applied           Status = "Applied"
	HireVue           Status = "HireVue"
	HireVueComplete   Status = "HireVue Complete"
	OA                Status = "OA"
	OAComplete        Status = "OA Complete"
	Interview         Status = "Interview"
	InterviewComplete Status = "Interview Complete"
	Offer             Status = "Offer"
	Accepted          Status = "Accepted"
	Rejected          Status = "Rejected"
	Declined          Status = "Declined"
)

// IsValid checks if a Status is valid
func (s Status) IsValid() bool {
	switch s {
	case Applied, HireVue, HireVueComplete, OA, OAComplete, Interview, InterviewComplete, Offer, Accepted, Rejected, Declined:
		return true
	}
	return false
}

// ByStatus implements sort.Interface based on the Status field
type ByStatus []Status

func (s ByStatus) Len() int { return len(s) }
func (s ByStatus) Less(i, j int) bool {
	order := map[Status]int{
		"Applied":            0,
		"HireVue":            1,
		"HireVue Complete":   2,
		"OA":                 3,
		"OA Complete":        4,
		"Interview":          5,
		"Interview Complete": 6,
		"Offer":              7,
		"Accepted":           8,
		"Rejected":           9,
		"Declined":           10,
	}
	return order[s[i]] < order[s[j]]
}
func (s ByStatus) Swap(i, j int) { s[i], s[j] = s[j], s[i] }
