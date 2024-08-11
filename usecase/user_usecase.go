package usecase

import (
	"errors"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
	"golang.org/x/crypto/bcrypt"
)

type UserUsecase interface {
	FindUserByEmail(email string) (dto.ResponseFindUser, error)
	RemoveUser(email string) (dto.ResponseFindUser, error)
	ChangePasswordUser(newPass dto.DtoChangePassword, email string) error
	FindPasswordUser(email string) string
	FindUserByRole(role string) ([]model.Resgist, error)
	ChangeDataUser(data dto.DtoUpdateUser, email string) (dto.DtoUpdateUser, error)
	GetDoctor() ([]dto.DcotorDto, error)
	GetUserByID(id string) (dto.ResponseFindUser, error)
	ChangeEmailUser(newEmail string, id string) error
}

type userUsecase struct {
	userRepo repository.UserRepository
}

func (u *userUsecase) FindUserByEmail(email string) (dto.ResponseFindUser, error) {

	if email == "" {
		return dto.ResponseFindUser{}, errors.New("email cannot be empty")
	}

	res, err := u.userRepo.FindUserByEmail(email)

	if err != nil {
		return dto.ResponseFindUser{}, err
	}

	return res, nil
}

func (u *userUsecase) RemoveUser(email string) (dto.ResponseFindUser, error) {

	if email == "" {
		return dto.ResponseFindUser{}, errors.New("id cannot be empty")
	}

	res, err := u.userRepo.DeleteUser(email)

	if err != nil {
		return dto.ResponseFindUser{}, err
	}

	return res, nil
}

func (u *userUsecase) ChangePasswordUser(newPass dto.DtoChangePassword, email string) error {
	if len(newPass.Password) < 8 {
		return errors.New("password must be more than 8 characters")
	}

	password := u.FindPasswordUser(email)

	err := bcrypt.CompareHashAndPassword([]byte(password), []byte(newPass.OldPassword))

	if err != nil {
		return errors.New("enter the old password correctly")
	}

	if newPass.OldPassword == newPass.Password {
		return errors.New("the new password cannot be the same as the old password")
	}

	newPasswordEncrypt, err := bcrypt.GenerateFromPassword([]byte(newPass.Password), 10)

	if err != nil {
		return err
	}

	return u.userRepo.UpdatePasswordUser(string(newPasswordEncrypt), email)
}

func (u *userUsecase) ChangeDataUser(data dto.DtoUpdateUser, email string) (dto.DtoUpdateUser, error) {

	var emailVer model.Resgist

	if data.Address == "" && data.Email == "" && data.Name == "" {
		return dto.DtoUpdateUser{}, errors.New("one of the values must be filled in")
	}

	if data.Email != "" {
		emailVer.Email = data.Email
		_, err := u.FindUserByEmail(data.Email)

		if err != nil {
			return dto.DtoUpdateUser{}, err
		}

		if !emailVer.ValidateEmail() {
			return dto.DtoUpdateUser{}, errors.New("email not valid")
		}
	}

	if data.Name != "" {
		if len(data.Name) < 2 {
			return dto.DtoUpdateUser{}, errors.New("name must be more than 2 characters")
		}
	}

	if data.Address.(string) != "" {
		if len(data.Address.(string)) < 10 {
			return dto.DtoUpdateUser{}, errors.New("please input complate address")
		}
	}

	return u.userRepo.UpdateDataUser(data, email)
}

func (u *userUsecase) FindUserByRole(role string) ([]model.Resgist, error) {
	if role == "" {
		return nil, errors.New("role can't be empty")
	}

	return u.userRepo.GetUserByRole(role)
}

func (u *userUsecase) FindPasswordUser(email string) string {
	return u.userRepo.GetPasswordUser(email)
}

func (u *userUsecase) GetDoctor() ([]dto.DcotorDto, error) {
	return u.userRepo.GetDoctor()
}

func (u *userUsecase) GetUserByID(id string) (dto.ResponseFindUser, error) {
	return u.userRepo.GetUserByID(id)
}

func (u *userUsecase) ChangeEmailUser(newEmail string, id string) error {
	res, err := u.userRepo.FindUserByEmail(newEmail)

	if err == nil || res.ID != "" {
		return errors.New("sory but, email already exist")
	}

	return u.userRepo.ChangeEmailUser(newEmail, id)
}

func NewUserUsecase(userRepo repository.UserRepository) UserUsecase {
	return &userUsecase{userRepo}
}
