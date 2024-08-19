package controller

import (
	"errors"
	"fmt"
	"net/http"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/gin-gonic/gin"
)

type queueController struct {
	queueUsecase usecase.QueueUsecase
	authMd       middleware.AuthMiddleware
	rg           *gin.RouterGroup
}

func (q *queueController) rescheduleQueue(c *gin.Context) {
	var data dto.QueueDto

	if err := c.ShouldBindJSON(&data); err != nil {
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err := q.queueUsecase.Reschedule(data)

	if err != nil {
		fmt.Println(err.Error())
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"Message": "Success Reschedule Queue"})
}

func (q *queueController) createNewQueue(c *gin.Context) {
	var payloadQueue dto.QueueDto

	if err := c.ShouldBind(&payloadQueue); err != nil {
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	res, err := q.queueUsecase.CreateNewQueue(payloadQueue)

	if err != nil {
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Success Add Queue",
		"Data":    res,
	})
}

func (q *queueController) viewAllQueue(c *gin.Context) {
	period := c.Query("period")
	status := c.Query("status")
	id := c.Query("id")

	if id == "null" {
		getId, exist := c.Get("userID")
		if exist {
			id = getId.(string)
		}
	}

	res, err := q.queueUsecase.ViewAllQueue(id, status, period)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Success View All Queue",
		"Data":    res,
	})
}

func (q *queueController) removeQueue(c *gin.Context) {
	queueId := c.Param("id")

	if queueId == "" {
		c.JSON(http.StatusAccepted, gin.H{"Error": "please fill queue id"})
		return
	}

	err := q.queueUsecase.RemoveQueue(queueId)

	if err != nil {
		c.JSON(http.StatusAccepted, gin.H{"Error": "please fill queue id"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "Success Remove Queue"})
}

func (q *queueController) viewQueueByPatientId(c *gin.Context) {
	var userId, status string
	var id interface{}

	id = c.Query("userId")

	if id == "" {
		id, _ = c.Get("userID")
		userId = id.(string)
	}

	status = c.Query("status")

	res, err := q.queueUsecase.ViewQueueByPatientId(userId, status)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Succes View Queue By Id",
		"Data":    res,
	})
}

func (q *queueController) cancelQueue(c *gin.Context) {
	var Queue struct {
		ID string `json:"id"`
	}

	if err := c.ShouldBindJSON(&Queue); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err := q.queueUsecase.CancelQueue(Queue.ID)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusAccepted, gin.H{"message": "success cancel your queue"})
}

func (q *queueController) updateStatusQueue(c *gin.Context) {
	var DataRequired struct {
		Id     string `json:"id"`
		Status string `json:"status"`
	}

	if err := c.ShouldBindJSON(&DataRequired); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	fmt.Println(DataRequired)

	err := q.queueUsecase.UpdateStatusQue(DataRequired.Id, DataRequired.Status)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "success update status queues"})
}

func (q *queueController) validateQueue(c *gin.Context) {
	var validateReq dto.ValidateQueue

	if err := c.ShouldBindJSON(&validateReq); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	valid := q.queueUsecase.ValidateQueue(validateReq.DoctorId, validateReq.OpenTime, validateReq.Date, validateReq.ToStts)

	if !valid {
		c.JSON(http.StatusBadRequest, gin.H{"Error": "queue is full"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "ok"})
}

func (q *queueController) countDataReservasiOneMounth(c *gin.Context) {
	res, err := q.queueUsecase.CountDataReservasiOneMounth()

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success count data reservation", "totalData": res})
}

func (q *queueController) QueueRouter() {
	r := q.rg.Group("queues")

	r.PUT("reschedules", q.rescheduleQueue)
	r.PUT("cancel", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.cancelQueue)
	r.PUT("update-status-queues", q.authMd.JwtVerify("Doctor", "Admin"), q.updateStatusQueue)
	r.POST("", q.createNewQueue)
	r.GET("views", q.authMd.JwtVerify("Doctor", "Admin"), q.viewAllQueue)
	r.GET("view", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.viewQueueByPatientId)
	r.DELETE("", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.removeQueue)
	r.POST("validate", q.validateQueue)
	r.GET("count-queues", q.authMd.JwtVerify("Admin"), q.countDataReservasiOneMounth)
}

func NewQueueController(queueUsecase usecase.QueueUsecase, authMd middleware.AuthMiddleware, rg *gin.RouterGroup) *queueController {
	return &queueController{
		queueUsecase: queueUsecase,
		authMd:       authMd,
		rg:           rg,
	}
}
