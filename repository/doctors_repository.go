package repository

import (
	"database/sql"
	"strconv"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
)

type DoctorsRepository interface {
	DoctorUpdateProfile(data dto.DocterRegister) error
	FindDoctorById(id string) (data dto.DcotorDto, err error)
	FindAllDoctor() (data []dto.DcotorDto, err error)
}

type doctorRepo struct {
	db *sql.DB
}

func (d *doctorRepo) DoctorUpdateProfile(data dto.DocterRegister) error {
	qry := "Update doctor_detail Set age=$1, degree=$2, description=$3"
	qry2 := "Update users Set name=$1, address=$2 Where id=$3"
	tx, err := d.db.Begin()
	var value []interface{}

	value = append(value, data.DoctorDetail.Age, data.DoctorDetail.Degree, data.DoctorDetail.Description)
	index := 3
	if err != nil {
		tx.Rollback()
		return err
	}

	if data.DoctorDetail.Photos != "" {
		index++
		qry += ", photos=$" + strconv.Itoa(index)
		value = append(value, data.DoctorDetail.Photos)
	}

	index++

	qry += " Where doctor_id=$" + strconv.Itoa(index)
	value = append(value, data.Doctor.ID)
	_, err = tx.Exec(qry, value...)

	if err != nil {
		tx.Rollback()
		return err
	}

	_, err = tx.Exec(qry2, data.Doctor.Name, data.Doctor.Address, data.Doctor.ID)

	if err != nil {
		tx.Rollback()
		return err
	}

	tx.Commit()

	return nil
}

func (d *doctorRepo) FindDoctorById(id string) (data dto.DcotorDto, err error) {
	qry := "select d.id, d.name, d.email, d.address, dd.photos, dd.age, dd.description,dd.degree From users d Join doctor_detail dd on dd.doctor_id = d.id Where d.id=$1"

	err = d.db.QueryRow(qry, id).Scan(&data.Id, &data.Name, &data.Email, &data.Address, &data.Photos, &data.Age, &data.Description, &data.Degree)
	if err == sql.ErrNoRows {
		return dto.DcotorDto{}, nil
	}

	return
}

func (d *doctorRepo) FindAllDoctor() (data []dto.DcotorDto, err error) {
	qry := "Select d.name, dd.degree From users d Join doctor_detail dd on dd.doctor_id = d.id"

	row, err := d.db.Query(qry)

	if err != nil {
		return nil, err
	}

	for row.Next() {
		doctorDto := dto.DcotorDto{}

		err = row.Scan(&doctorDto.Name, &doctorDto.Degree)

		if err != nil {
			return
		}

		data = append(data, doctorDto)
	}

	return
}

func NewDoctorRepository(db *sql.DB) DoctorsRepository {
	return &doctorRepo{db}
}
