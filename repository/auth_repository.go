package repository

import (
	"database/sql"
	"errors"
	"fmt"
	"math/rand"
	"os"
	"strconv"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/common"
	"github.com/joho/godotenv"
	"github.com/sendgrid/sendgrid-go"
	"github.com/sendgrid/sendgrid-go/helpers/mail"
)

type AuthRepository interface {
	Regist(data model.Resgist) (dto.ResgistResponse, error)
	Login(email string) (dto.Login, error)
	EmailVerify(email string) (verifyCode string, err error)
	TokenVerify(tokenModel model.TokenAkses) error
	InsertNewDokter(dataDoctor model.DoctorDetail) (model.DoctorDetail, error)
}

type authRepository struct {
	db       *sql.DB
	jwtVerif common.JwtToken
}

func (a *authRepository) Regist(data model.Resgist) (response dto.ResgistResponse, err error) {
	qry := `Insert Into users (name,email,password,address,role) Values($1,$2,$3,$4,$5) Returning id,created_at,updated_at`

	response = dto.ResgistResponse{
		Name:  data.Name,
		Email: data.Email,
	}

	err = a.db.QueryRow(qry, data.Name, data.Email, data.Password, data.Address, data.Role).Scan(&response.Id, &response.CreatedAt, &response.UpdateAt)

	return
}

func (a *authRepository) Login(email string) (data dto.Login, err error) {
	qry := "Select id,email,password,role,name From users Where email=$1"

	data.Email = email

	err = a.db.QueryRow(qry, email).Scan(&data.ID, &data.Email, &data.Password, &data.Role, &data.Name)

	return
}

func (a *authRepository) EmailVerify(email string) (verifyCode string, err error) {
	if err = godotenv.Load(); err != nil {
		return
	}

	rand.Seed(time.Now().UnixNano())
	min := 100000
	max := 999999

	randomValue := rand.Intn(max-min+1) + min

	from := mail.NewEmail("Annur Bahagia", "akbarraw09@gmail.com")
	subject := "Email Verication Code - From Dental Clinic Dr Vony Nur Santi"
	to := mail.NewEmail(email, email)

	plainTextContent := strconv.Itoa(randomValue)
	htmlContent := "<strong>" + plainTextContent + "</strong>"

	message := mail.NewSingleEmail(from, subject, to, plainTextContent, htmlContent)
	client := sendgrid.NewSendClient(os.Getenv("SENDGRID_API_KEY"))
	response, err := client.Send(message)

	if err != nil {
		return "", err
	} else {
		fmt.Println(response.StatusCode)
		fmt.Println(response.Body)
		fmt.Println(response.Headers)
	}

	verifyCode = plainTextContent

	return
}

func (a *authRepository) TokenVerify(tokenModel model.TokenAkses) error {
	claims, err := a.jwtVerif.VerfifyToken(tokenModel)

	if err != nil {
		return errors.New("failed verify Token")
	}

	exp := claims["exp"].(float64)

	if time.Now().After(time.Unix(int64(exp), 10)) {
		return errors.New("token already expired")
	}

	return nil
}

func (a *authRepository) InsertNewDokter(dataDoctor model.DoctorDetail) (model.DoctorDetail, error) {
	qry := "Insert Into doctor_detail (doctor_id,photos,age,degree) Values($1,$2,$3,$4) Returning id,created_at,updated_at"

	id := dataDoctor.DoctorId.ID
	err := a.db.QueryRow(qry, id, dataDoctor.Photos, dataDoctor.Age, dataDoctor.Degree).Scan(&dataDoctor.Id, &dataDoctor.CreatedAt, &dataDoctor.UpdateAt)

	if err != nil {
		_, err := a.db.Exec("Delete From users Where id=$1", dataDoctor.DoctorId.ID)

		if err != nil {
			return model.DoctorDetail{}, err
		}

		return model.DoctorDetail{}, err
	}

	return dataDoctor, nil
}

func NewAuthRepository(db *sql.DB, jwtVerif common.JwtToken) AuthRepository {
	return &authRepository{db, jwtVerif}
}
