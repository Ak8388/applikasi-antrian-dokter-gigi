package usecase

import (
	"errors"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
)

type DayOffDoctorUscase interface {
	AddDayOff(req model.DoctorsDayOffReq) error
	EditDayOff(req model.DoctorsDayOffReq) error
	GetDataDayOff(docID string) ([]model.DoctorsDayOffRes, error)
	DeleteDayOff(id string) error
}

type dayOffDoctorUscase struct {
	dayOffRepo repository.DayOffDoctorRepo
}

func (d *dayOffDoctorUscase) AddDayOff(req model.DoctorsDayOffReq) error {
	layout := "2006-01-02 15:04:05"
	dayOffT, err := time.Parse(layout, req.DayOff)

	if err != nil {
		return err
	}

	year, month, day := dayOffT.Date()
	tnowYear, tnowMonth, tnowDay := time.Now().Date()

	if year == tnowYear && month == tnowMonth && day == tnowDay {
		return errors.New("days off can't same today")
	}

	dayOfReq := model.DoctorsDayOff{
		DoctorId:    req.DoctorId,
		DayOff:      dayOffT,
		Description: req.Description,
	}

	return d.dayOffRepo.AddDayOff(dayOfReq)
}

func (d *dayOffDoctorUscase) EditDayOff(req model.DoctorsDayOffReq) error {
	layout := "2006-01-02 15:04:05"
	dayOffT, err := time.Parse(layout, req.DayOff)

	if err != nil {
		return err
	}

	year, month, day := dayOffT.Date()
	tnowYear, tnowMonth, tnowDay := time.Now().Date()

	if year == tnowYear && month == tnowMonth && day == tnowDay {
		return errors.New("days off can't same today")
	}

	dayOfReq := model.DoctorsDayOff{
		ID:          req.ID,
		DayOff:      dayOffT,
		Description: req.Description,
	}

	return d.dayOffRepo.EditDayOff(dayOfReq)
}

func (d *dayOffDoctorUscase) GetDataDayOff(docID string) ([]model.DoctorsDayOffRes, error) {
	if docID == "" {
		return nil, errors.New("doctors id can't be empty")
	}

	return d.dayOffRepo.GetDataDayOff(docID)
}

func (d *dayOffDoctorUscase) DeleteDayOff(id string) error {
	if id == "" {
		return errors.New("day off id can't be empty")
	}

	return d.dayOffRepo.DeleteDayOff(id)
}

func NewDayOffUsecase(dayOffRepo repository.DayOffDoctorRepo) DayOffDoctorUscase {
	return &dayOffDoctorUscase{dayOffRepo}
}
