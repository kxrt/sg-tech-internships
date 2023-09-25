package models

type Internship struct {
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
