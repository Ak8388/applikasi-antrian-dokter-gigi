package controller

import (
	"errors"
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

func (q *queueController) switchingQueue(c *gin.Context) {
	var data dto.QueueDto

	if err := c.ShouldBind(&data); err != nil {
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	err := q.queueUsecase.SwitchingQueue(data)

	if err != nil {
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"Message": "Success Switching Queue"})
}

func (q *queueController) createNewQueue(c *gin.Context) {
	var payloadQueue dto.QueueDto

	if err := c.ShouldBind(&payloadQueue); err != nil {
		err = errors.Join(err, errors.New("make sure you fill in the data correctly"))
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	userID, _ := c.Get("userID")
	payloadQueue.Patient = userID.(string)

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
	res, err := q.queueUsecase.ViewAllQueue()

	if err != nil {
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
	userId, _ := c.Get("userId")

	res, err := q.queueUsecase.ViewQueueByPatientId(userId.(string))

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Succes View Queue By Id",
		"Data":    res,
	})
}

func (q *queueController) QueueRouter() {
	r := q.rg.Group("queues")

	r.PUT("", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.switchingQueue)
	r.POST("", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.createNewQueue)
	r.GET("views", q.authMd.JwtVerify("Doctor", "Admin"), q.viewAllQueue)
	r.GET("view", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.viewQueueByPatientId)
	r.DELETE("", q.authMd.JwtVerify("Doctor", "Patient", "Admin"), q.removeQueue)
}

func NewQueueController(queueUsecase usecase.QueueUsecase, authMd middleware.AuthMiddleware, rg *gin.RouterGroup) *queueController {
	return &queueController{
		queueUsecase: queueUsecase,
		authMd:       authMd,
		rg:           rg,
	}
}
