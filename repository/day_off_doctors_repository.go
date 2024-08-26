package repository

import (
	"database/sql"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
)

type DayOffDoctorRepo interface {
	AddDayOff(req model.DoctorsDayOff) error
	EditDayOff(req model.DoctorsDayOff) error
	GetDataDayOff(docID string) ([]model.DoctorsDayOffRes, error)
	DeleteDayOff(id string) error
}

type dayOffDoctorRepo struct {
	db *sql.DB
}

func (d *dayOffDoctorRepo) AddDayOff(req model.DoctorsDayOff) error {
	qry := "insert into doctors_day_off (doctor_id, day_off, description) Values($1,$2,$3)"

	_, err := d.db.Exec(qry, req.DoctorId, req.DayOff, req.Description)

	return err
}

func (d *dayOffDoctorRepo) EditDayOff(req model.DoctorsDayOff) error {
	qry := "Update doctors_day_off Set day_off=$1, description=$2 Where id=$3"

	_, err := d.db.Exec(qry, req.DayOff, req.Description, req.ID)
	return err
}

func (d *dayOffDoctorRepo) GetDataDayOff(docID string) (doctorDaysOff []model.DoctorsDayOffRes, err error) {
	qry := "Select * From doctors_day_off Where doctor_id=$1 AND day_off > CURRENT_DATE Order By created_at DESC"

	row, err := d.db.Query(qry, docID)

	if err != nil {
		return nil, err
	}

	for row.Next() {
		doctorDay := model.DoctorsDayOffRes{}
		err = row.Scan(&doctorDay.ID, &doctorDay.DoctorId, &doctorDay.DayOff, &doctorDay.Description, &doctorDay.CreatedAt, &doctorDay.UpdateAt)

		if err != nil {
			return
		}

		doctorDaysOff = append(doctorDaysOff, doctorDay)
	}

	return
}

func (d *dayOffDoctorRepo) DeleteDayOff(id string) error {
	qry := "Delete from doctors_day_off Where id=$1"

	_, err := d.db.Exec(qry, id)
	return err
}

func NewDoctorDayOff(db *sql.DB) DayOffDoctorRepo {
	return &dayOffDoctorRepo{db}
}
