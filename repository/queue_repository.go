package repository

import (
	"database/sql"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
)

type QueueRepo interface {
	SwitchingQueue(data model.Queue) error
	CreateQueue(data model.Queue) (model.Queue, error)
	GetAllQueue() ([]model.Queue, error)
	DeleteQueue(queueID string) error
	GetQueueByPatientId(patientId string) (model.Queue, error)
}

type queueRepo struct {
	db *sql.DB
}

func (q *queueRepo) SwitchingQueue(data model.Queue) error {
	var switcingData model.Queue
	qry := "Select queue_number,queue_time From queues Where queue_number=$1 AND queue_date=$2"
	qry2 := "Update queues Set queue_number=$1,queue_time=$2 + INTERVAL '30 minutes',updated_at Where queue_number=$1 AND queue_date=$2"
	qry3 := "Update queues Set queue_number=$1,queue_time=$2 - INTERVAL '30 minutes',updated_at Where queue_number=$1 AND queue_date=$2"

	tx, err := q.db.Begin()

	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.QueryRow(qry, data.QueueNumber+1, data.QueueDate).Scan(&switcingData.QueueNumber, &switcingData.QueueTime)

	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Exec(qry2, data.QueueNumber+1, data.QueueTime, time.Now(), data.QueueNumber, data.QueueDate)

	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Exec(qry3, switcingData.QueueNumber-1, switcingData.QueueTime, time.Now(), switcingData.QueueNumber, switcingData.QueueDate)

	if err != nil {
		tx.Rollback()
		return err
	}

	err = tx.Commit()

	if err != nil {
		tx.Rollback()
		return err
	}

	return nil
}

func (q *queueRepo) CreateQueue(data model.Queue) (model.Queue, error) {
	qry := "Insert Into queues (doctor_id, patient_id, queue_date, queue_time, queue_number, note) Values($1,$2,$3,$4,$5,$6) Returning created_at,updated_at"
	tx, err := q.db.Begin()

	if err != nil {
		return model.Queue{}, err
	}

	err = tx.QueryRow(qry, data.Doctor, data.Patient, data.QueueDate, data.QueueTime, data.QueueNumber, data.Note).Scan(&data.CreatedAt, &data.UpdateAt)

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

func (q *queueRepo) GetAllQueue() (data []model.Queue, err error) {
	qry := "Select * From queues"

	rows, err := q.db.Query(qry)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		tempQueue := model.Queue{}
		err = rows.Scan(&tempQueue.ID, &tempQueue.Doctor, &tempQueue.Patient, &tempQueue.QueueDate, &tempQueue.QueueTime, &tempQueue.QueueNumber, &tempQueue.Note, &tempQueue.CreatedAt, &tempQueue.UpdateAt)

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

func (q *queueRepo) GetQueueByPatientId(patientId string) (data model.Queue, err error) {
	qry := "Select * From queues Where patient_id=$1 AND status=process"

	err = q.db.QueryRow(qry, patientId).Scan(&data.ID, &data.Doctor, &data.Patient, &data.QueueDate, &data.QueueTime, &data.QueueNumber, &data.Note, &data.Status, &data.CreatedAt, &data.UpdateAt)

	return
}

func NewQueueRepository(db *sql.DB) QueueRepo {
	return &queueRepo{db}
}
