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
