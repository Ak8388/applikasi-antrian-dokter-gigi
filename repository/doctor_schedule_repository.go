package repository

import (
	"database/sql"
	"errors"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
)

type DoctorScheduleRepo interface {
	InsertNewSchedule(schedule model.ScheduleDoctors) (model.ScheduleDoctors, error)
	UpdateNewSchedule(schedule model.ScheduleDoctors) (model.ScheduleDoctors, error)
	DeleteDoctorSchedule(idSchedule string) error
	GetAllSchedule() ([]model.ScheduleDoctors, error)
	GetScheduleByDoctor(doctorId string) ([]model.ScheduleDoctors, error)
	GetScheduleTimeByDayAndDocter(doctorId, day string) ([]time.Time, error)
}

type doctorScheduleRepo struct {
	db *sql.DB
}

func (ds doctorScheduleRepo) InsertNewSchedule(schedule model.ScheduleDoctors) (model.ScheduleDoctors, error) {
	qry := "Insert Into doctor_scedules (doctor_id,day,opening_hours,closing_hours) Values($1,$2,$3,$4) Returning id,created_at,updated_at"

	err := ds.db.QueryRow(qry, schedule.DoctorID, schedule.Day, schedule.OpeningHours, schedule.ClosingHours).Scan(&schedule.ID, &schedule.CreatedAt, &schedule.UpdatedAt)

	if err != nil {
		return model.ScheduleDoctors{}, errors.Join(errors.New("failed insert doctor schedule because "), err)
	}

	return schedule, nil
}

func (ds doctorScheduleRepo) UpdateNewSchedule(schedule model.ScheduleDoctors) (model.ScheduleDoctors, error) {
	return model.ScheduleDoctors{}, nil
}

func (ds doctorScheduleRepo) DeleteDoctorSchedule(idSchedule string) error {
	qry := "Delete From doctor_scedules Where id=$1"
	_, err := ds.db.Exec(qry, idSchedule)

	if err != nil {
		return errors.Join(errors.New("failed delete doctor schedule because "), err)
	}

	return nil
}

func (ds doctorScheduleRepo) GetAllSchedule() (data []model.ScheduleDoctors, err error) {
	qry := "Select * from doctor_scedules"

	rows, err := ds.db.Query(qry)

	if err != nil {
		return nil, errors.Join(errors.New("failed select doctor schedule table because "), err)
	}

	for rows.Next() {
		schedule := model.ScheduleDoctors{}

		err = rows.Scan(&schedule.ID, &schedule.DoctorID, &schedule.Day, &schedule.OpeningHours, &schedule.ClosingHours, &schedule.CreatedAt, &schedule.UpdatedAt)

		if err != nil {
			return nil, errors.Join(errors.New("failed scan data doctor schedule into variable because "), err)
		}

		data = append(data, schedule)
	}

	return
}

func (ds doctorScheduleRepo) GetScheduleByDoctor(doctorId string) (data []model.ScheduleDoctors, err error) {
	qry := "Select * from doctor_scedules Where doctor_id=$1"

	rows, err := ds.db.Query(qry, doctorId)

	if err != nil {
		return nil, errors.Join(errors.New("failed select doctor schedule table because "), err)
	}

	for rows.Next() {
		schedule := model.ScheduleDoctors{}

		err = rows.Scan(&schedule.ID, &schedule.DoctorID, &schedule.Day, &schedule.OpeningHours, &schedule.ClosingHours, &schedule.CreatedAt, &schedule.UpdatedAt)

		if err != nil {
			return nil, errors.Join(errors.New("failed scan data doctor schedule into variable because "), err)
		}

		data = append(data, schedule)
	}

	return
}

func (ds doctorScheduleRepo) GetScheduleTimeByDayAndDocter(doctorId, day string) (data []time.Time, err error) {
	qry := "Select opening_hours from doctor_scedules where doctor_id=$1 And day=$2"
	rows, err := ds.db.Query(qry, doctorId, day)

	if err != nil {
		if err == sql.ErrNoRows {
			return nil, errors.New("data not found")
		} else {
			return nil, err
		}
	}

	for rows.Next() {
		temp := time.Time{}
		err = rows.Scan(&temp)
		if err != nil {
			return nil, err
		}

		data = append(data, temp)
	}

	if data == nil {
		return nil, errors.New("record not found")
	}

	return
}

func NewScheduleRepository(db *sql.DB) DoctorScheduleRepo {
	return &doctorScheduleRepo{db}
}
