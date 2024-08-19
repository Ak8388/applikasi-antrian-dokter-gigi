package controller

import (
	"fmt"
	"net/http"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/gin-gonic/gin"
)

type doctorSchedule struct {
	drShUsecase usecase.DoctorScheduleUsecase
	r           *gin.RouterGroup
	mAuth       middleware.AuthMiddleware
}

func (drSch *doctorSchedule) createNewSchedule(c *gin.Context) {
	var payloadSchedule dto.ScheduleDoctors

	if err := c.ShouldBindJSON(&payloadSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	docId := c.Query("doc-id")

	if docId == "" {
		userId, exist := c.Get("userID")

		if exist {
			docId = userId.(string)
		}
	}

	payloadSchedule.DoctorID = docId

	res, err := drSch.drShUsecase.CreateNewSchedule(payloadSchedule)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Success Created Schedule",
		"Data":    res,
	})
}

func (drSch *doctorSchedule) updateNewSchedule(c *gin.Context) {
	var paylodSchedule dto.ScheduleDoctors

	if err := c.ShouldBindJSON(&paylodSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	docId := c.Query("doc-id")

	if docId == "" {
		userId, exist := c.Get("userID")

		if exist {
			docId = userId.(string)
		}
	}

	paylodSchedule.DoctorID = docId

	res, err := drSch.drShUsecase.UpdateNewSchedule(paylodSchedule)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Success Update Data Schedule",
		"Data":    res,
	})
}

func (drSch *doctorSchedule) removeDoctorSchedule(c *gin.Context) {
	id := c.Param("id")
	err := drSch.drShUsecase.RemoveDoctorSchedule(id)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Message": "Succes Remove Schedule"})
}

func (drSch *doctorSchedule) viewAllSchedule(c *gin.Context) {
	res, err := drSch.drShUsecase.ViewAllSchedule()

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Success View All Schedule",
		"Data":    res,
	})
}

func (drSch *doctorSchedule) viewScheduleByDoctor(c *gin.Context) {
	drId := c.Query("drId")

	if drId == "" {
		id, exist := c.Get("userID")

		if exist {
			drId = id.(string)
		}

	}

	res, err := drSch.drShUsecase.ViewScheduleByDoctor(drId)

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Success View All Schedule",
		"Data":    res,
	})
}

func (drsch *doctorSchedule) findDoctorScheduleByDoctorIdAndDay(c *gin.Context) {
	id := c.Param("id")
	day := c.Param("day")

	res, err := drsch.drShUsecase.FindScheduleTimeByDayAndDocter(id, day)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "succes find doctor schedule",
		"data":    res,
	})
}

func (drSch *doctorSchedule) ScheduleRouter() {
	r := drSch.r.Group("schedules")
	r.GET("opening-time/:id/:day", drSch.mAuth.JwtVerify("Admin", "Patient"), drSch.findDoctorScheduleByDoctorIdAndDay)
	r.GET("dr-schedules", drSch.mAuth.JwtVerify("Admin", "Patient", "Doctor"), drSch.viewScheduleByDoctor)
	r.GET("", drSch.mAuth.JwtVerify("Admin", "Patient", "Doctor"), drSch.viewAllSchedule)
	r.POST("", drSch.mAuth.JwtVerify("Doctor", "Admin"), drSch.createNewSchedule)
	r.PUT("", drSch.mAuth.JwtVerify("Doctor", "Admin"), drSch.updateNewSchedule)
	r.DELETE("/:id", drSch.mAuth.JwtVerify("Doctor", "Admin"), drSch.removeDoctorSchedule)
}

func NewScheduleDoctor(drShUsecase usecase.DoctorScheduleUsecase, mAuth middleware.AuthMiddleware, r *gin.RouterGroup) *doctorSchedule {
	return &doctorSchedule{
		drShUsecase: drShUsecase,
		r:           r,
		mAuth:       mAuth,
	}
}
