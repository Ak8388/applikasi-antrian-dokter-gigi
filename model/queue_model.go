package model

import (
	"time"
)

type Queue struct {
	ID          string    `json:"ID"`
	Doctor      string    `json:"doctorId"`
	Patient     string    `json:"patientId"`
	Schedule    string    `json:"scheduleId"`
	QueueDate   time.Time `json:"queueDate"`
	QueueTime   time.Time `json:"queueTime"`
	QueueNumber int       `json:"queueNumber"`
	Note        string    `json:"note"`
	Status      string    `json:"status"`
	CreatedAt   time.Time `json:"createdAt"`
	UpdateAt    time.Time `json:"updateAt"`
}

func (q *Queue) StatusValidate() bool {
	return q.Status == "Created" || q.Status == "Process" || q.Status == "Reschedule" || q.Status == "Cancel" || q.Status == "Finish"
}
