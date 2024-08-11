package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/gin-gonic/gin"
)

type doctorController struct {
	am  middleware.AuthMiddleware
	rg  *gin.RouterGroup
	dus usecase.DoctorUsecase
}

func (d *doctorController) doctorUpdateProfile(c *gin.Context) {
	_, header, err := c.Request.FormFile("photos")
	var fileLocation string

	if err != nil {
		if err != http.ErrMissingFile {
			c.JSON(http.StatusBadRequest, gin.H{"error": "failed get data from form"})
			return
		}
	}

	if err != http.ErrMissingFile {
		fileLocation = filepath.Join("asset/photos", header.Filename)
		os.Mkdir("asset/photos", os.ModePerm)
		c.SaveUploadedFile(header, fileLocation)
	}

	dataString := c.Request.FormValue("json")
	var dataJson dto.DocterRegister
	fmt.Println(dataString)
	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}

	dataJson.DoctorDetail.Photos = fileLocation

	drId, exist := c.Get("userID")
	if exist {
		dataJson.Doctor.ID = drId.(string)
	}

	err = d.dus.DoctorUpdateProfile(dataJson)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Success update data doctor",
	})
}

func (d *doctorController) findDoctorById(c *gin.Context) {
	id := c.Query("id")

	if id == "" {
		drId, exist := c.Get("userID")

		if exist {
			id = drId.(string)
		}
	}

	res, err := d.dus.FindDoctorById(id)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "success get data doctor",
		"data":    res,
	})
}

func (d *doctorController) DoctorsRouter() {
	r := d.rg.Group("doctors")
	r.GET("", d.am.JwtVerify("Doctor", "Admin"), d.findDoctorById)
	r.PUT("profiles", d.am.JwtVerify("Doctor", "Admin"), d.doctorUpdateProfile)
}

func NewDoctorController(dus usecase.DoctorUsecase, am middleware.AuthMiddleware, rg *gin.RouterGroup) *doctorController {
	return &doctorController{
		am:  am,
		rg:  rg,
		dus: dus,
	}
}
