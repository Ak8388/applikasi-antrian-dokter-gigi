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
	Reschedule(dataDto dto.QueueDto) error
	CreateNewQueue(dataDto dto.QueueDto) (model.Queue, error)
	ViewAllQueue(id, status, period string) ([]dto.QueueDtoResponse, error)
	RemoveQueue(queueID string) error
	ViewQueueByPatientId(patientId, status string) ([]dto.QueueDtoResponse, error)
	CancelQueue(id string) error
	UpdateStatusQue(id, status string) error
}

type queueUsecase struct {
	queueRepo repository.QueueRepo
	userUC    UserUsecase
}

func (q *queueUsecase) Reschedule(dataDto dto.QueueDto) error {
	res, err := q.queueRepo.GetQueueByID(dataDto.ID)
	layout := "2006-01-02 15:04:05"

	if err != nil {
		return err
	}

	if res.Status != "created" || res.QueueDate.Before(time.Now()) {
		return errors.New("cannot reschedule your queue is invalid")
	}

	qDate, err := time.Parse(layout, dataDto.QueueDate)

	if err != nil {
		return err
	}

	qTime, err := time.Parse(layout, dataDto.QueueTime)

	if err != nil {
		return err
	}

	data := model.Queue{
		ID:          dataDto.ID,
		QueueDate:   qDate,
		QueueTime:   qTime,
		QueueNumber: int(q.queueRepo.CountDataReservasi(dataDto.Doctor, dataDto.QueueDate, dataDto.QueueTime)) + 1,
		Status:      "Reschedule",
	}

	if !data.StatusValidate() {
		return errors.New("please fill the status correctly")
	}

	if data.QueueDate.IsZero() {
		return errors.New("please fill in the control date correctly")
	}

	if data.QueueDate.Before(time.Now()) {
		return errors.New("can't fill queue date before now")
	}

	if data.QueueTime.IsZero() {
		return errors.New("please fill in the control time correctly")
	}

	if data.QueueNumber > 1 {
		x := 30 * (data.QueueNumber - 1)
		data.QueueTime = qTime.Add(time.Duration(x) * time.Minute)
	} else {
		data.QueueTime = qTime
	}

	statusLwr := strings.ToLower(data.Status)
	data.Status = statusLwr

	return q.queueRepo.Reschedule(data)
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
		QueueNumber: int(q.queueRepo.CountDataReservasi(dataDto.Doctor, dataDto.QueueDate, dataDto.QueueTime)) + 1,
		Note:        dataDto.Note,
		Status:      "Created",
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

func (q *queueUsecase) ViewAllQueue(id, status, period string) ([]dto.QueueDtoResponse, error) {
	return q.queueRepo.GetAllQueue(id, status, period)
}

func (q *queueUsecase) RemoveQueue(queueID string) error {
	if queueID == "" {
		return errors.New("queue id can't be empty")
	}

	return q.queueRepo.DeleteQueue(queueID)
}

func (q *queueUsecase) ViewQueueByPatientId(patientId, status string) (resDto []dto.QueueDtoResponse, err error) {
	if patientId == "" {
		return nil, errors.New("queue id can't be empty")
	}

	sttsLwr := strings.ToLower(status)

	res, err := q.queueRepo.GetQueueByPatientId(patientId, sttsLwr)

	if err != nil {
		return nil, err
	}

	for _, data := range res {
		patient, err := q.userUC.GetUserByID(patientId)

		if err != nil {
			return nil, err
		}

		doctor, err := q.userUC.GetUserByID(data.Doctor)

		if err != nil {
			return nil, err
		}

		queDto := dto.QueueDtoResponse{
			ID: data.ID,
			Doctor: dto.ResponseFindUser{
				ID:    data.Doctor,
				Name:  doctor.Name,
				Email: doctor.Email,
			},
			Patient: dto.ResponseFindUser{
				ID:    data.Patient,
				Name:  patient.Name,
				Email: patient.Email,
			},
			QueueDate: data.QueueDate,
			QueueTime: data.QueueTime,
			Note:      data.Note,
			Status:    data.Status,
		}

		resDto = append(resDto, queDto)
	}

	return
}

func (q *queueUsecase) CancelQueue(id string) error {
	queue, err := q.queueRepo.GetQueueByID(id)

	if err != nil {
		return err
	}

	if queue.Status != "created" && queue.Status != "reschedule" {
		return errors.New("queues not valid for cancel")
	}

	return q.queueRepo.CancelQueue(id, "cancel")
}

func (q *queueUsecase) UpdateStatusQue(id, status string) error {
	res, err := q.queueRepo.GetQueueByID(id)

	if err != nil {
		return err
	}

	if res.Status != "created" && res.Status != "reschedule" && res.Status != "process" {
		return errors.New("not valid reservation")
	}

	return q.queueRepo.UpdateStatusQue(id, status)
}

func NewQueueUsecase(queueRepo repository.QueueRepo, userUc UserUsecase) QueueUsecase {
	return &queueUsecase{queueRepo, userUc}
}
