package repository

import (
	"database/sql"
	"errors"
	"strconv"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
)

type UserRepository interface {
	FindUserByEmail(email string) (dto.ResponseFindUser, error)
	UpdateDataUser(data dto.DtoUpdateUser, email string) (dto.DtoUpdateUser, error)
	UpdatePasswordUser(newPass, email string) error
	GetPasswordUser(email string) string
	GetUserByRole(role string) ([]model.Resgist, error)
	DeleteUser(email string) (dto.ResponseFindUser, error)
	GetDoctor() ([]dto.DcotorDto, error)
	GetUserByID(id string) (dto.ResponseFindUser, error)
	ChangeEmailUser(newEmail string, id string) error
}

type userRepository struct {
	db *sql.DB
}

func (u *userRepository) FindUserByEmail(email string) (data dto.ResponseFindUser, err error) {
	qry := "Select name, email, address, role, updated_at, created_at From users Where email=$1"

	err = u.db.QueryRow(qry, email).Scan(&data.Name, &data.Email, &data.Address, &data.Role, &data.UpdateAt, &data.CreatedAt)

	if err == sql.ErrNoRows {
		return dto.ResponseFindUser{}, errors.New("user not found")
	}

	return
}

func (u *userRepository) DeleteUser(email string) (data dto.ResponseFindUser, err error) {
	qry := "Select role From users Where email=$1"
	tx, err := u.db.Begin()

	if err != nil {
		err = errors.Join(errors.New("filed create transaction"), err)
		return
	}

	err = u.db.QueryRow(qry, email).Scan(&data.Role)

	if err != nil {
		err = errors.Join(errors.New("failed select role from users"), err)
		return
	}

	if data.Role == "Doctor" {
		qry = "Delete From doctor_detail Where doctor_id IN(select id from users Where email=$1)"

		_, err = tx.Exec(qry, email)

		if err != nil {
			err = errors.Join(errors.New("failed delete doctor_detail"), err)
			tx.Rollback()
			return
		}
	}

	qry = "Delete From users Where email=$1 Returning name,email,address,created_at,updated_at"

	err = tx.QueryRow(qry, email).Scan(&data.Name, &data.Email, &data.Address, &data.CreatedAt, &data.UpdateAt)

	if err != nil {
		err = errors.Join(errors.New("failed delete user"), err)
		tx.Rollback()
		return
	}

	tx.Commit()

	return
}

func (u *userRepository) UpdateDataUser(data dto.DtoUpdateUser, email string) (dto.DtoUpdateUser, error) {
	qry := `Update users Set `
	var dataUpdate []interface{}
	index := 1

	if data.Name != "" {
		qry += "name=$" + strconv.Itoa(index)
		dataUpdate = append(dataUpdate, data.Name)
		index++
	}

	if data.Address != "" {
		dataUpdate = append(dataUpdate, data.Address)
		if index > 1 {
			qry += " ,address=$" + strconv.Itoa(index)
		} else {
			qry += "address=$" + strconv.Itoa(index)
		}
		index++
	}

	dataUpdate = append(dataUpdate, time.Now())
	qry += " ,updated_at=$" + strconv.Itoa(index)
	index++

	dataUpdate = append(dataUpdate, email)
	qry += " Where email=$" + strconv.Itoa(index) + " Returning name, email, address"

	err := u.db.QueryRow(qry, dataUpdate...).Scan(&data.Name, &data.Email, &data.Address)

	if err != nil {
		return dto.DtoUpdateUser{}, err
	}

	return data, nil
}

func (u *userRepository) GetPasswordUser(email string) string {
	qry := "select password from users where email=$1"
	var password string

	err := u.db.QueryRow(qry, email).Scan(&password)

	if err != nil {
		return ""
	}

	return password
}

func (u *userRepository) GetUserByRole(role string) (data []model.Resgist, err error) {
	qry := "Select * From users where role=$1"

	row, err := u.db.Query(qry, role)

	if err == sql.ErrNoRows {
		return nil, errors.New("data not found")
	}

	for row.Next() {
		var temp model.Resgist
		err = row.Scan(&temp.ID, &temp.Name, &temp.Email, &temp.Password, &temp.Address, &temp.Role, &temp.CreatedAt, &temp.UpdateAt)

		if err != nil {
			return
		}

		data = append(data, temp)
	}

	return
}

func (u *userRepository) GetDoctor() (data []dto.DcotorDto, err error) {
	qry := "Select d.id,d.name,d.email,d.address,dd.photos,dd.age,dd.degree,dd.description from users d Join doctor_detail dd On d.id = dd.doctor_id"

	rows, err := u.db.Query(qry)

	if err != nil {
		return nil, err
	}

	for rows.Next() {
		doctor := dto.DcotorDto{}

		err = rows.Scan(&doctor.Id, &doctor.Name, &doctor.Email, &doctor.Address, &doctor.Photos, &doctor.Age, &doctor.Degree, &doctor.Description)

		if err != nil {
			return
		}
		data = append(data, doctor)
	}

	return
}

func (u *userRepository) UpdatePasswordUser(newPass, email string) error {
	qry := "Update users Set password=$1,updated_at=$2 Where email=$3"
	_, err := u.db.Exec(qry, newPass, time.Now(), email)

	return err
}

func (u *userRepository) GetUserByID(id string) (res dto.ResponseFindUser, err error) {
	qry := "Select name,email,address,role From users Where id=$1"

	err = u.db.QueryRow(qry, id).Scan(&res.Name, &res.Email, &res.Address, &res.Role)

	return
}

func (u *userRepository) ChangeEmailUser(newEmail string, id string) error {
	qry := "Update users Set email=$1 Where id=$2"
	_, err := u.db.Exec(qry, newEmail, id)

	if err != nil {
		return err
	}

	return nil
}

func NewUserRepository(db *sql.DB) UserRepository {
	return &userRepository{db}
}
