package model

import "time"

type DoctorsDayOff struct {
	ID          string    `json:"id"`
	DoctorId    string    `json:"doctorId"`
	DayOff      time.Time `json:"dayOff"`
	Description string    `json:"description"`
}

type DoctorsDayOffReq struct {
	ID          string `json:"id"`
	DoctorId    string `json:"doctorId"`
	DayOff      string `json:"dayOff"`
	Description string `json:"description"`
}

type DoctorsDayOffRes struct {
	ID          string    `json:"id"`
	DoctorId    string    `json:"doctorId"`
	DayOff      string    `json:"dayOff"`
	Description string    `json:"description"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
}
