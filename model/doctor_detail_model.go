package model

import "time"

type DoctorDetail struct {
	Id          string    `json:"id"`
	DoctorId    Resgist   `json:"idDoctor"`
	Photos      any       `json:"photos"`
	Age         any       `json:"age"`
	Degree      any       `json:"degree"`
	Description any       `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
}
