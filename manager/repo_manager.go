package manager

import (
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/common"
)

type RepoManager interface {
	AuthRepo() repository.AuthRepository
	UserRepo() repository.UserRepository
	QueueRepo() repository.QueueRepo
	ScheduleRepo() repository.DoctorScheduleRepo
	DcotorRepo() repository.DoctorsRepository
}

type repoManager struct {
	infra    InfraManager
	jwtVerif common.JwtToken
}

func (rm *repoManager) DcotorRepo() repository.DoctorsRepository {
	return repository.NewDoctorRepository(rm.infra.Connection())
}

func (rm *repoManager) AuthRepo() repository.AuthRepository {
	return repository.NewAuthRepository(rm.infra.Connection(), rm.jwtVerif)
}

func (rm *repoManager) UserRepo() repository.UserRepository {
	return repository.NewUserRepository(rm.infra.Connection())
}

func (rm *repoManager) QueueRepo() repository.QueueRepo {
	return repository.NewQueueRepository(rm.infra.Connection())
}

func (rm *repoManager) ScheduleRepo() repository.DoctorScheduleRepo {
	return repository.NewScheduleRepository(rm.infra.Connection())
}

func NewRepoManager(infra InfraManager, jwtVerif common.JwtToken) RepoManager {
	return &repoManager{infra, jwtVerif}
}
