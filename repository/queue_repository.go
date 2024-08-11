package repository

import (
	"database/sql"
	"fmt"
	"strconv"
	"strings"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
)

type QueueRepo interface {
	Reschedule(data model.Queue) error
	CancelQueue(id, status string) error
	CreateQueue(data model.Queue) (model.Queue, error)
	GetAllQueue(id, status, period string) ([]dto.QueueDtoResponse, error)
	DeleteQueue(queueID string) error
	GetQueueByPatientId(patientId, status string) (data []model.Queue, err error)
	GetQueueByID(id string) (model.Queue, error)
	CountDataReservasi(id, date, time string) int
	UpdateStatusQue(id, status string) error
	GetQueueByDateAndPatientID(id, date string) bool
	ValidateQueue(id, open, date string) bool
}

type queueRepo struct {
	db *sql.DB
}

func (q *queueRepo) Reschedule(data model.Queue) (err error) {
	qry2 := "Update queues Set queue_date=$1, queue_time=$2, queue_number=$3,status=$4, id_schedule=$5 Where id=$6"

	_, err = q.db.Exec(qry2, data.QueueDate, data.QueueTime, data.QueueNumber, data.Status, data.Schedule, data.ID)

	return
}

func (q *queueRepo) CreateQueue(data model.Queue) (model.Queue, error) {
	qry := "Insert Into queues (doctor_id, patient_id, queue_date, queue_time, queue_number, note, status, id_schedule) Values($1,$2,$3,$4,$5,$6,$7,$8) Returning created_at,updated_at"

	tx, err := q.db.Begin()

	if err != nil {
		return model.Queue{}, err
	}

	err = tx.QueryRow(qry, data.Doctor, data.Patient, data.QueueDate, data.QueueTime, data.QueueNumber, data.Note, data.Status, data.Schedule).Scan(&data.CreatedAt, &data.UpdateAt)

	if err != nil {
		return model.Queue{}, err
	}

	err = tx.Commit()

	if err != nil {
		tx.Rollback()
		return model.Queue{}, err
	}

	return data, nil
}

func (q *queueRepo) GetAllQueue(id, status, period string) (data []dto.QueueDtoResponse, err error) {
	qry := "Select q.id,q.queue_date,q.queue_time,q.queue_number,q.note,q.status,d.id,d.name,d.email,p.id,p.name,p.email From queues q Join users d ON q.doctor_id = d.id Join users p On q.patient_id = p.id Where q.doctor_id=$1"
	var value []interface{}
	index := 1
	value = append(value, id)

	if status != "" {
		value = append(value, status)
		index++
		qry += " AND status=$" + strconv.Itoa(index)
	}

	if period != "" {
		periodSplit := strings.Split(period, " ")
		fmt.Println("Period :", period)
		index++
		value = append(value, periodSplit[0], periodSplit[1])
		qry += fmt.Sprintf(" AND queue_date BETWEEN $%d AND ", index)
		index++
		qry += fmt.Sprintf("$%d", index)
	} else {
		index++
		value = append(value, time.Now())
		qry += fmt.Sprintf(" AND queue_date=$%d", index)
	}

	qry += " Order By queue_date DESC, queue_time ASC, queue_number ASC"
	fmt.Println(qry)
	rows, err := q.db.Query(qry, value...)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		tempQueue := dto.QueueDtoResponse{}
		err = rows.Scan(&tempQueue.ID, &tempQueue.QueueDate, &tempQueue.QueueTime, &tempQueue.QueueNumber, &tempQueue.Note, &tempQueue.Status, &tempQueue.Doctor.ID, &tempQueue.Doctor.Name, &tempQueue.Doctor.Email, &tempQueue.Patient.ID, &tempQueue.Patient.Name, &tempQueue.Patient.Email)

		if err != nil {
			return nil, err
		}

		data = append(data, tempQueue)
	}

	return
}

func (q *queueRepo) DeleteQueue(queueID string) error {
	qry2 := "Delete From queues Where id=$1"

	_, err := q.db.Exec(qry2, queueID)

	if err != nil {
		return err
	}

	return nil
}

func (q *queueRepo) GetQueueByPatientId(patientId, status string) (data []model.Queue, err error) {
	var qry string
	var args []interface{}

	args = append(args, patientId)
	if status == "" {
		qry = "Select * From queues Where patient_id=$1"
	} else {
		qry = "Select * From queues Where patient_id=$1 AND status=$2"
		args = append(args, status)
	}

	qry += " Order By queue_date"

	rows, err := q.db.Query(qry, args...)

	if err != nil {
		return
	}

	for rows.Next() {
		queue := model.Queue{}
		err = rows.Scan(&queue.ID, &queue.Doctor, &queue.Patient, &queue.QueueDate, &queue.QueueTime, &queue.QueueNumber, &queue.Note, &queue.Status, &queue.CreatedAt, &queue.UpdateAt, &queue.Schedule)

		if err != nil {
			return
		}

		data = append(data, queue)
	}

	return
}

func (q *queueRepo) CountDataReservasi(id, date, t string) (totalData int) {
	sql1 := "Select closing_hours from doctor_scedules Where doctor_id=$1 AND opening_hours=$2 AND day=$3"
	sql := "Select COUNT(id) as total_data From queues Where doctor_id=$1 AND queue_date=$2 AND queue_time BETWEEN $3 AND $4 AND (status=$5 OR status=$6)"
	closeHours := ""

	layout := "2006-01-02 15:04:05"
	qDate, _ := time.Parse(layout, date)
	err := q.db.QueryRow(sql1, id, t, qDate.Weekday().String()).Scan(&closeHours)

	if err != nil {
		return 0
	}

	temp1 := strings.Split(t, " ")
	temp2 := strings.Replace(closeHours, "0000-01-01", temp1[0], -1)
	temp2 = strings.Replace(temp2, "Z", "", -1)
	temp2 = strings.Replace(temp2, "T", " ", -1)
	tempFix := strings.Split(temp2, " ")

	err = q.db.QueryRow(sql, id, date, temp1[1], tempFix[1], "created", "reschedule").Scan(&totalData)
	fmt.Println("Total Data =", totalData)
	if err != nil {
		return 0
	}

	return
}

func (q *queueRepo) GetQueueByID(id string) (data model.Queue, err error) {
	qry := "Select doctor_id, patient_id, queue_date, queue_time, queue_number, note, status From queues Where id=$1"

	err = q.db.QueryRow(qry, id).Scan(&data.Doctor, &data.Patient, &data.QueueDate, &data.QueueTime, &data.QueueNumber, &data.Note, &data.Status)

	return
}

func (q *queueRepo) UpdateStatusQue(id, status string) error {
	query := "Update queues Set status=$1 Where id=$2"

	_, err := q.db.Exec(query, status, id)

	return err
}

func (q *queueRepo) CancelQueue(id, status string) error {
	qry := "Update queues Set status=$1 where id=$2"
	_, err := q.db.Exec(qry, status, id)

	return err
}

func (q *queueRepo) GetQueueByDateAndPatientID(id, date string) bool {
	qry := "Select Count(id) As total_data From queues Where patient_id=$1 AND queue_date=$2"
	countData := 0

	err := q.db.QueryRow(qry, id, date).Scan(&countData)

	if err != nil {
		return err != sql.ErrNoRows
	}

	if countData > 0 {
		return true
	}

	return false
}

func (q *queueRepo) ValidateQueue(id, open, date string) bool {
	qry1 := "Select closing_hours from doctor_scedules Where doctor_id=$1 AND opening_hours=$2 AND day=$3"
	qry2 := "Select queue_time From queues Where doctor_id = $1 AND queue_time BETWEEN $2 AND $3 AND queue_date=$4 AND (status=$5 OR status=$6) ORDER BY queue_time DESC LIMIT 1"

	closeHours := ""
	qTime := ""

	layout := "2006-01-02 15:04:05"
	qDate, _ := time.Parse(layout, date)

	err := q.db.QueryRow(qry1, id, open, qDate.Weekday().String()).Scan(&closeHours)

	if err != nil {
		return false
	}
	// 2024-08-13 15:00:00   0000-01-01T18:00:00Z
	temp1 := strings.Split(open, " ")
	temp2 := strings.Replace(closeHours, "0000-01-01", temp1[0], -1)
	temp2 = strings.Replace(temp2, "Z", "", -1)
	temp2 = strings.Replace(temp2, "T", " ", -1)
	tempFix := strings.Split(temp2, " ")

	fmt.Println("Iye Jam Na=", open, " ", temp2)
	err = q.db.QueryRow(qry2, id, temp1[1], tempFix[1], date, "created", "reschedule").Scan(&qTime)

	if err != nil {
		if err != sql.ErrNoRows {
			return false
		} else {
			return true
		}
	}

	temp3 := strings.Replace(qTime, "0000-01-01", temp1[0], -1)
	temp3 = strings.Replace(temp3, "Z", "", -1)
	temp3 = strings.Replace(temp3, "T", " ", -1)

	qtimeT, err := time.Parse(layout, temp3)

	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	clT, err := time.Parse(layout, temp2)

	if err != nil {
		fmt.Println(err.Error())
		return false
	}

	if qtimeT.After(clT) || qtimeT.Equal(clT) {
		return false
	}

	return true
}

func NewQueueRepository(db *sql.DB) QueueRepo {
	return &queueRepo{db}
}
