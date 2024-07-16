package dto

import "time"

type ScheduleDoctors struct {
	ID           string    `json:"id"`
	DoctorID     string    `json:"doctorId"`
	Day          string    `json:"days"`
	OpeningHours string    `json:"openingHours"`
	ClosingHours string    `json:"closingHours"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}
