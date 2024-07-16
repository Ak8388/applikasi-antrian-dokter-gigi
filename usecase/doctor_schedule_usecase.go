package usecase

import (
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
)

type DoctorScheduleUsecase interface {
	CreateNewSchedule(schedule dto.ScheduleDoctors) (model.ScheduleDoctors, error)
	UpdateNewSchedule(schedule dto.ScheduleDoctors) (model.ScheduleDoctors, error)
	RemoveDoctorSchedule(idSchedule string) error
	ViewAllSchedule() ([]model.ScheduleDoctors, error)
	ViewScheduleByDoctor(doctorId string) ([]model.ScheduleDoctors, error)
	FindScheduleTimeByDayAndDocter(doctorId, day string) ([]time.Time, error)
}

type doctorScheduleUsecase struct {
	dsRepo repository.DoctorScheduleRepo
}

func (ds *doctorScheduleUsecase) CreateNewSchedule(scheduleDto dto.ScheduleDoctors) (model.ScheduleDoctors, error) {
	layout := "2006-01-02 15:04:05"
	opH, err := time.Parse(layout, scheduleDto.OpeningHours)

	if err != nil {
		return model.ScheduleDoctors{}, err
	}

	clsH, err := time.Parse(layout, scheduleDto.ClosingHours)

	if err != nil {
		return model.ScheduleDoctors{}, err
	}

	schedule := model.ScheduleDoctors{
		DoctorID:     scheduleDto.DoctorID,
		Day:          scheduleDto.Day,
		OpeningHours: opH,
		ClosingHours: clsH,
	}

	if schedule.DoctorID == "" {
		return model.ScheduleDoctors{}, errors.New("sorry, but doctor id can't be empty")
	}

	if schedule.OpeningHours.After(time.Date(schedule.OpeningHours.Year(), schedule.OpeningHours.Month(), schedule.OpeningHours.Day(), 22, 0, 0, 0, schedule.OpeningHours.Location())) {
		return model.ScheduleDoctors{}, errors.New("please fill opening time column to be correctly")
	}

	if schedule.ClosingHours.After(time.Date(schedule.ClosingHours.Year(), schedule.ClosingHours.Month(), schedule.ClosingHours.Day(), 23, 0, 0, 0, schedule.ClosingHours.Location())) {
		return model.ScheduleDoctors{}, errors.New("please fill closing time column to be correctly")
	}

	if schedule.OpeningHours.After(schedule.ClosingHours) {
		return model.ScheduleDoctors{}, errors.New("you can't fill closing hours greater than closing hours")
	}

	if !schedule.ScheduleDayValidate() {
		return model.ScheduleDoctors{}, errors.New("please fill day column to be correctly")
	}

	dayTitleCase := strings.Title(schedule.Day)
	schedule.Day = dayTitleCase

	res, err := ds.ViewScheduleByDoctor(schedule.DoctorID)
	if err != nil {
		fmt.Println(err)
	}
	for _, data := range res {
		if schedule.Day == data.Day && data.OpeningHours.Equal(schedule.OpeningHours) {
			fmt.Println("EEk")
			return model.ScheduleDoctors{}, errors.New("sorry, but this schedule already exist")
		}
	}

	return ds.dsRepo.InsertNewSchedule(schedule)
}

func (ds *doctorScheduleUsecase) UpdateNewSchedule(scheduleDto dto.ScheduleDoctors) (model.ScheduleDoctors, error) {
	schedule := model.ScheduleDoctors{}
	return ds.dsRepo.UpdateNewSchedule(schedule)
}

func (ds *doctorScheduleUsecase) RemoveDoctorSchedule(idSchedule string) error {
	if idSchedule == "" {
		return errors.New("sorry, but schedule id can't be empty")
	}

	return ds.dsRepo.DeleteDoctorSchedule(idSchedule)
}

func (ds *doctorScheduleUsecase) ViewAllSchedule() ([]model.ScheduleDoctors, error) {
	return ds.dsRepo.GetAllSchedule()
}

func (ds *doctorScheduleUsecase) ViewScheduleByDoctor(doctorId string) ([]model.ScheduleDoctors, error) {
	if doctorId == "" {
		return nil, errors.New("sorry, but doctor id can't be empty")
	}

	return ds.dsRepo.GetScheduleByDoctor(doctorId)
}

func (ds *doctorScheduleUsecase) FindScheduleTimeByDayAndDocter(doctorId, day string) ([]time.Time, error) {
	if doctorId == "" || day == "" {
		return nil, errors.New("please fill doctor id and schedule day")
	}

	return ds.dsRepo.GetScheduleTimeByDayAndDocter(doctorId, day)
}

func NewUsecaseSchedule(dsRepo repository.DoctorScheduleRepo) DoctorScheduleUsecase {
	return &doctorScheduleUsecase{dsRepo}
}
