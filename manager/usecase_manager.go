package manager

import (
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/common"
)

type UsecaseManager interface {
	AuthUsecase() usecase.AuthUsecase
	UserUsecase() usecase.UserUsecase
	QueueUsecase() usecase.QueueUsecase
	ScheduleDoctor() usecase.DoctorScheduleUsecase
	Doctor() usecase.DoctorUsecase
}

type usecaseManager struct {
	jwtGenerate common.JwtToken
	repo        RepoManager
}

func (um *usecaseManager) AuthUsecase() usecase.AuthUsecase {
	return usecase.NewAuthUsecase(um.repo.AuthRepo(), um.jwtGenerate, um.UserUsecase())
}

func (um *usecaseManager) UserUsecase() usecase.UserUsecase {
	return usecase.NewUserUsecase(um.repo.UserRepo())
}

func (um *usecaseManager) QueueUsecase() usecase.QueueUsecase {
	return usecase.NewQueueUsecase(um.repo.QueueRepo(), um.UserUsecase(), um.ScheduleDoctor())
}

func (um *usecaseManager) ScheduleDoctor() usecase.DoctorScheduleUsecase {
	return usecase.NewUsecaseSchedule(um.repo.ScheduleRepo())
}

func (um *usecaseManager) Doctor() usecase.DoctorUsecase {
	return usecase.NewDoctorUsecase(um.UserUsecase(), um.repo.DcotorRepo())
}

func NewUsecaseManager(jwtGenerate common.JwtToken, repo RepoManager) UsecaseManager {
	return &usecaseManager{
		jwtGenerate: jwtGenerate,
		repo:        repo,
	}
}
