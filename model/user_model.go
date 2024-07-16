package model

import (
	"regexp"
	"time"
)

type Resgist struct {
	ID        string    `json:"ID" `
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Password  string    `json:"password"`
	Address   any       `json:"address"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdateAt  time.Time `json:"updateAt"`
}

func (r *Resgist) IsValideRole() bool {
	return r.Role == "Doctor" || r.Role == "Patient" || r.Role == "Admin"
}

func (r *Resgist) ValidateEmail() bool {
	regex := `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$`

	match, _ := regexp.MatchString(regex, r.Email)
	return match
}
