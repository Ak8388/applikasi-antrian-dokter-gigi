package dto

import "time"

type QueueDto struct {
	ID          string    `json:"ID"`
	Doctor      string    `json:"doctorId"`
	Patient     string    `json:"patientId"`
	QueueDate   string    `json:"queueDate"`
	QueueTime   string    `json:"queueTime"`
	QueueNumber int       `json:"queueNumber"`
	Note        string    `json:"note"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
}
