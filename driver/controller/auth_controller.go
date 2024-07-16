package controller

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/gin-gonic/gin"
)

type authController struct {
	autUC usecase.AuthUsecase
	route *gin.RouterGroup
	am    middleware.AuthMiddleware
}

func (ac *authController) createNewUser(c *gin.Context) {
	var payload model.Resgist

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "make sure the value you input is correct"})
		return
	}
	res, err := ac.autUC.CreateNewUser(payload)

	if err != nil {
		fmt.Println("EROR =", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	c.JSON(http.StatusAccepted, gin.H{
		"Message": "Registerasi Success",
		"Data":    res,
	})
}

func (ac *authController) loginUser(c *gin.Context) {
	var payload dto.Login

	if err := c.ShouldBindJSON(&payload); err != nil {
		fmt.Println(payload)
		c.JSON(http.StatusBadRequest, gin.H{"error": "make sure the value you input is correct"})
		return
	}

	res, err := ac.autUC.LoginUser(payload.Email, payload.Password)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	role := ac.am.GetRole(res)

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Login Success",
		"Data":    res,
		"role":    role,
	})
}

func (ac *authController) emailVerify(c *gin.Context) {
	var Email struct {
		Emails string `json:"email" binding:"required"`
		Ron    string `json:"rOn"`
	}

	if err := c.ShouldBindJSON(&Email); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "please fill email"})
		return
	}

	res, err := ac.autUC.EmailVerify(Email.Emails, Email.Ron)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"verifyCode": res})
}

func (ac *authController) tokenVerify(c *gin.Context) {
	auth := c.Request.Header.Get("Authorization")
	tokenString := strings.Replace(auth, "Bearer ", "", -1)

	tokenModel := model.TokenAkses{
		Token: tokenString,
	}

	err := ac.autUC.TokenVerify(tokenModel)

	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"Success": "token still active"})
}

func (ac *authController) createNewDocter(c *gin.Context) {
	_, header, err := c.Request.FormFile("photos")
	var fileLocation string

	if err != http.ErrMissingFile {
		c.JSON(http.StatusBadRequest, gin.H{"error": "failed get data from form"})
		return
	}

	if err != http.ErrMissingFile {
		fileLocation = filepath.Join("asset/photos", header.Filename)
		os.Mkdir("asset/photos", os.ModePerm)
		c.SaveUploadedFile(header, fileLocation)
	}

	dataString := c.Request.FormValue("json")
	var dataJson dto.DocterRegister

	if err = json.Unmarshal([]byte(dataString), &dataJson); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed unmarshal object json" + err.Error()})
		return
	}
	fmt.Println(dataJson)
	dataJson.DoctorDetail.Photos = fileLocation
	res, err := ac.autUC.CreateNewDokter(dataJson)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Success Add Data User",
		"Data":    res,
	})
}

func (ac *authController) Router() {
	r := ac.route.Group("auth")

	r.POST("login", ac.loginUser)
	r.POST("regist", ac.createNewUser)
	r.POST("verify-email", ac.emailVerify)
	r.GET("verify", ac.tokenVerify)
	r.POST("doctors", ac.am.JwtVerify("Admin"), ac.createNewDocter)
}

func NewAuthController(authUC usecase.AuthUsecase, am middleware.AuthMiddleware, r *gin.RouterGroup) *authController {
	return &authController{
		autUC: authUC,
		route: r,
		am:    am,
	}
}
