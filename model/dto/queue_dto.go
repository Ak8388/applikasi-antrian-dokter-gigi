package dto

import "time"

type QueueDto struct {
	ID        string `json:"id"`
	Doctor    string `json:"doctorId"`
	Patient   string `json:"patientId"`
	QueueDate string `json:"queueDate"`
	QueueTime string `json:"queueTime"`
	Note      string `json:"note"`
	Status    string `json:"status"`
}

type QueueDtoResponse struct {
	ID          string           `json:"id"`
	Doctor      ResponseFindUser `json:"doctor"`
	Patient     ResponseFindUser `json:"patient"`
	QueueDate   time.Time        `json:"queueDate"`
	QueueTime   time.Time        `json:"queueTime"`
	QueueNumber int              `json:"queueNumber"`
	Note        string           `json:"note"`
	Status      string           `json:"status"`
	CreatedAt   time.Time        `json:"createdAt"`
	UpdateAt    time.Time        `json:"updateAt"`
}
