package usecase

import (
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
)

type DoctorUsecase interface {
	DoctorUpdateProfile(data dto.DocterRegister) error
	FindDoctorById(id string) (data dto.DcotorDto, err error)
	FindAllDoctor() (data []dto.DcotorDto, err error)
}

type doctorUsecase struct {
	userUsecase UserUsecase
	repoDoctor  repository.DoctorsRepository
}

func (d *doctorUsecase) DoctorUpdateProfile(data dto.DocterRegister) error {
	return d.repoDoctor.DoctorUpdateProfile(data)
}

func (d *doctorUsecase) FindDoctorById(id string) (data dto.DcotorDto, err error) {
	return d.repoDoctor.FindDoctorById(id)
}

func (d *doctorUsecase) FindAllDoctor() (data []dto.DcotorDto, err error) {
	return d.repoDoctor.FindAllDoctor()
}

func NewDoctorUsecase(userUsecase UserUsecase, repoDoctor repository.DoctorsRepository) DoctorUsecase {
	return &doctorUsecase{userUsecase, repoDoctor}
}
