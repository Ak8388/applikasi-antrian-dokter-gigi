package model

import "time"

type ScheduleDoctors struct {
	ID           string    `json:"id"`
	DoctorID     string    `json:"doctorId"`
	Day          string    `json:"days"`
	OpeningHours time.Time `json:"openingHours"`
	ClosingHours time.Time `json:"closingHours"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

func (s *ScheduleDoctors) ScheduleDayValidate() bool {
	return s.Day == "Sunday" || s.Day == "Monday" || s.Day == "Tuesday" || s.Day == "Wednesday" || s.Day == "Thursday" || s.Day == "Friday" || s.Day == "Saturday"
}
