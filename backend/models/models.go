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
	ID     string         `json:"user_id"`
	Status map[int]string `json:"status"`
}

type UpdateRequest struct {
	InternshipID int    `json:"internship_id"`
	Status       string `json:"status"`
}
