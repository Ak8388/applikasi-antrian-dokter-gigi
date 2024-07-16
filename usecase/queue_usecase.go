package usecase

import (
	"errors"
	"strings"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/repository"
)

type QueueUsecase interface {
	SwitchingQueue(dataDto dto.QueueDto) error
	CreateNewQueue(dataDto dto.QueueDto) (model.Queue, error)
	ViewAllQueue() ([]model.Queue, error)
	RemoveQueue(queueID string) error
	ViewQueueByPatientId(patientId string) (model.Queue, error)
}

type queueUsecase struct {
	queueRepo repository.QueueRepo
}

func (q *queueUsecase) SwitchingQueue(dataDto dto.QueueDto) error {
	layout := "2006-01-02 15:04:05"
	qDate, err := time.Parse(layout, dataDto.QueueDate)

	if err != nil {
		return err
	}

	qTime, err := time.Parse(layout, dataDto.QueueDate)

	if err != nil {
		return err
	}

	data := model.Queue{
		Doctor:      dataDto.Doctor,
		Patient:     dataDto.Patient,
		QueueDate:   qDate,
		QueueTime:   qTime,
		QueueNumber: dataDto.QueueNumber,
		Note:        dataDto.Note,
		Status:      dataDto.Status,
	}

	return q.queueRepo.SwitchingQueue(data)
}

func (q *queueUsecase) CreateNewQueue(dataDto dto.QueueDto) (model.Queue, error) {
	layout := "2006-01-02 15:04:05"
	qDate, err := time.Parse(layout, dataDto.QueueDate)

	if err != nil {
		return model.Queue{}, err
	}

	qTime, err := time.Parse(layout, dataDto.QueueTime)

	if err != nil {
		return model.Queue{}, err
	}

	data := model.Queue{
		Doctor:      dataDto.Doctor,
		Patient:     dataDto.Patient,
		QueueDate:   qDate,
		QueueTime:   qTime,
		QueueNumber: dataDto.QueueNumber,
		Note:        dataDto.Note,
		Status:      dataDto.Status,
	}

	if data.Doctor == "" {
		return model.Queue{}, errors.New("doctor id can't be empty")
	}

	if data.Patient == "" {
		return model.Queue{}, errors.New("doctor id can't be empty")
	}

	if data.QueueDate.IsZero() {
		return model.Queue{}, errors.New("please fill in the control date correctly")
	}

	if data.QueueDate.Before(time.Now()) {
		return model.Queue{}, errors.New("can't fill queue date before now")
	}

	if data.QueueTime.IsZero() {
		return model.Queue{}, errors.New("please fill in the control time correctly")
	}

	if data.QueueNumber > 1 {
		x := 30 * (data.QueueNumber - 1)
		data.QueueTime = qTime.Add(time.Duration(x) * time.Minute)
	} else {
		data.QueueTime = qTime
	}

	if data.QueueNumber == 0 {
		return model.Queue{}, errors.New("please fill in the queue number correctly")
	}

	if !data.StatusValidate() {
		return model.Queue{}, errors.New("please fill the status correctly")
	}

	statusLwr := strings.ToLower(data.Status)
	data.Status = statusLwr

	return q.queueRepo.CreateQueue(data)
}

func (q *queueUsecase) ViewAllQueue() ([]model.Queue, error) {
	return q.queueRepo.GetAllQueue()
}

func (q *queueUsecase) RemoveQueue(queueID string) error {
	if queueID == "" {
		return errors.New("queue id can't be empty")
	}

	return q.queueRepo.DeleteQueue(queueID)
}

func (q *queueUsecase) ViewQueueByPatientId(patientId string) (model.Queue, error) {
	if patientId == "" {
		return model.Queue{}, errors.New("queue id can't be empty")
	}

	return q.queueRepo.GetQueueByPatientId(patientId)
}

func NewQueueUsecase(queueRepo repository.QueueRepo) QueueUsecase {
	return &queueUsecase{queueRepo}
}
