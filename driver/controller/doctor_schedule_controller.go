package controller

import (
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

	if err := c.ShouldBind(&payloadSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	userId, _ := c.Get("userID")
	payloadSchedule.DoctorID = userId.(string)

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

	if err := c.ShouldBind(&paylodSchedule); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	res, err := drSch.drShUsecase.UpdateNewSchedule(paylodSchedule)

	if err != nil {
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
	drId := c.Param("drId")
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
	r.GET("/:drId", drSch.mAuth.JwtVerify("Admin", "Patient", "Doctor"), drSch.viewScheduleByDoctor)
	r.GET("", drSch.mAuth.JwtVerify("Admin", "Patient", "Doctor"), drSch.viewAllSchedule)
	r.POST("", drSch.mAuth.JwtVerify("Doctor"), drSch.createNewSchedule)
	r.PUT("/:drId", drSch.mAuth.JwtVerify("Doctor"), drSch.updateNewSchedule)
	r.DELETE("/:id", drSch.mAuth.JwtVerify("Doctor", "Admin"), drSch.removeDoctorSchedule)
}

func NewScheduleDoctor(drShUsecase usecase.DoctorScheduleUsecase, r *gin.RouterGroup, mAuth middleware.AuthMiddleware) *doctorSchedule {
	return &doctorSchedule{
		drShUsecase: drShUsecase,
		r:           r,
		mAuth:       mAuth,
	}
}
