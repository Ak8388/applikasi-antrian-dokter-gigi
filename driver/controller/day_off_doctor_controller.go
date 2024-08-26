package controller

import (
	"fmt"
	"net/http"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/gin-gonic/gin"
)

type daysOffController struct {
	am        middleware.AuthMiddleware
	rg        *gin.RouterGroup
	daysOffUC usecase.DayOffDoctorUscase
}

func (d *daysOffController) addDayOff(c *gin.Context) {
	var req model.DoctorsDayOffReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if req.DoctorId == "" {
		id, exist := c.Get("userID")

		if exist {
			req.DoctorId = id.(string)
		}

	}

	err := d.daysOffUC.AddDayOff(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "success add day off"})
}

func (d *daysOffController) editDayOff(c *gin.Context) {
	var req model.DoctorsDayOffReq

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := d.daysOffUC.EditDayOff(req)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "success edit day off"})
}

func (d *daysOffController) getDataDayOff(c *gin.Context) {
	docID := c.Query("docId")

	if docID == "" {
		id, exist := c.Get("userID")

		if exist {
			docID = id.(string)
		}
	}

	res, err := d.daysOffUC.GetDataDayOff(docID)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success get data day off", "data": res})
}

func (d *daysOffController) deleteDayOff(c *gin.Context) {
	var ReqId struct {
		Id string `json:"id"`
	}

	if err := c.ShouldBindJSON(&ReqId); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	err := d.daysOffUC.DeleteDayOff(ReqId.Id)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success delete data day off"})
}

func (d *daysOffController) DaysOffRouter() {
	r := d.rg.Group("days-off")

	r.POST("", d.am.JwtVerify("Admin", "Doctor"), d.addDayOff)
	r.PUT("", d.am.JwtVerify("Admin", "Doctor"), d.editDayOff)
	r.GET("", d.am.JwtVerify("Admin", "Doctor", "Patient"), d.getDataDayOff)
	r.DELETE("", d.am.JwtVerify("Admin", "Doctor"), d.deleteDayOff)
}

func NewDayOffController(am middleware.AuthMiddleware, rg *gin.RouterGroup, daysOffUC usecase.DayOffDoctorUscase) *daysOffController {
	return &daysOffController{
		am:        am,
		rg:        rg,
		daysOffUC: daysOffUC,
	}
}
