package usecase

import (
	"errors"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/common"
	"golang.org/x/crypto/bcrypt"
)

type AuthUsecase interface {
	CreateNewUser(data model.Resgist) (dto.ResgistResponse, error)
	LoginUser(email, password string) (model.TokenAkses, error)
	EmailVerify(email, rOn string) (verifyCode string, err error)
	TokenVerify(tokenModel model.TokenAkses) error
	CreateNewDokter(dataDoctor dto.DocterRegister) (dto.DocterRegister, error)
}

type authUsecase struct {
	repoAuth      repository.AuthRepository
	tokenGenerate common.JwtToken
	userUc        UserUsecase
}

func (a *authUsecase) CreateNewUser(data model.Resgist) (dto.ResgistResponse, error) {

	if len(data.Name) < 2 {
		return dto.ResgistResponse{}, errors.New("name must be more than 2 characters")
	}

	if !data.ValidateEmail() {
		return dto.ResgistResponse{}, errors.New("email is not valid")
	}

	if len(data.Password) < 8 {
		return dto.ResgistResponse{}, errors.New("password must be more than 8 characters")
	}

	if !data.IsValideRole() {
		return dto.ResgistResponse{}, errors.New("role is note valid")
	}

	_, err := a.userUc.FindUserByEmail(data.Email)

	if err == nil {
		return dto.ResgistResponse{}, errors.New("email already exist")
	}

	encryptPass, errEnc := bcrypt.GenerateFromPassword([]byte(data.Password), 10)

	if errEnc != nil {
		return dto.ResgistResponse{}, errors.New("failed encrypt password")
	}

	data.Password = string(encryptPass)

	response, errReg := a.repoAuth.Regist(data)

	if errReg != nil {
		return dto.ResgistResponse{}, errReg
	}

	return response, nil
}

func (a *authUsecase) LoginUser(email, password string) (model.TokenAkses, error) {

	res, err := a.repoAuth.Login(email)

	if err != nil {
		return model.TokenAkses{}, err
	}

	if err := bcrypt.CompareHashAndPassword([]byte(res.Password), []byte(password)); err != nil {
		return model.TokenAkses{}, errors.New("password not metch with email")
	}

	token, errTok := a.tokenGenerate.GenerateToken(res.ID, email, res.Role, res.Name)

	if errTok != nil {
		return model.TokenAkses{}, errTok
	}

	return token, nil
}

func (a *authUsecase) EmailVerify(email, rOn string) (code string, err error) {

	if rOn != "regist" {
		_, err := a.userUc.FindUserByEmail(email)
		if err != nil {
			return "", errors.New("sorry, your email is not currently registered")
		}
	} else {
		code, err = a.repoAuth.EmailVerify(email)
	}

	return
}

func (a *authUsecase) TokenVerify(tokenModel model.TokenAkses) error {

	if tokenModel.Token == "" {
		return errors.New("token can't be empty")
	}

	return a.repoAuth.TokenVerify(tokenModel)
}

func (u *authUsecase) CreateNewDokter(dataDoctor dto.DocterRegister) (dto.DocterRegister, error) {
	dataUser := model.Resgist{
		Name:     dataDoctor.Doctor.Name,
		Email:    dataDoctor.Doctor.Email,
		Password: dataDoctor.Doctor.Password,
		Address:  dataDoctor.Doctor.Address,
		Role:     dataDoctor.Doctor.Role,
	}

	res, err := u.CreateNewUser(dataUser)

	if err != nil {
		return dto.DocterRegister{}, err
	}

	dataDoctor.DoctorDetail.DoctorId.ID = res.Id
	dataDoctor.Doctor.ID = res.Id
	dataDoctor.Doctor.CreatedAt = res.CreatedAt
	dataDoctor.Doctor.UpdateAt = res.UpdateAt

	res2, err := u.repoAuth.InsertNewDokter(dataDoctor.DoctorDetail)

	if err != nil {
		return dto.DocterRegister{}, err
	}

	dataDoctor.DoctorDetail = res2

	return dataDoctor, nil
}

func NewAuthUsecase(repoAuth repository.AuthRepository, t common.JwtToken, userUc UserUsecase) AuthUsecase {
	return &authUsecase{repoAuth: repoAuth, tokenGenerate: t, userUc: userUc}
}
