package controller

import (
	"fmt"
	"net/http"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model/dto"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/usecase"
	"github.com/gin-gonic/gin"
)

type userController struct {
	userUc         usecase.UserUsecase
	authMiddleware middleware.AuthMiddleware
	rg             *gin.RouterGroup
}

func (uc *userController) findUserByEmail(c *gin.Context) {
	email := c.Query("email")

	if email == "" {
		em, ex := c.Get("userEmail")
		if ex {
			email = em.(string)
		}
	}

	res, err := uc.userUc.FindUserByEmail(email)

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"mesage": "Succes Find User",
		"data":   res,
	})
}

func (uc *userController) deleteUser(c *gin.Context) {
	value := c.Query("email")

	if value == "" {
		res, _ := c.Get("userEmail")

		if res == nil {
			c.JSON(http.StatusBadRequest, gin.H{"error": "please input your email"})
			return
		}
	}

	res, err := uc.userUc.RemoveUser(value)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"Message": "Succes Find User",
		"Data":    res,
	})
}

func (uc *userController) changePasswordUser(c *gin.Context) {
	var payload dto.DtoChangePassword

	if err := c.ShouldBindJSON(&payload); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "make sure the value you input is correct"})
		return
	}

	email, _ := c.Get("userEmail")

	err := uc.userUc.ChangePasswordUser(payload, email.(string))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"Message": "Success change password"})
}

func (uc *userController) findUserByRole(c *gin.Context) {
	role := c.Param("role")

	res, err := uc.userUc.FindUserByRole(role)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Success Find All User",
		"Data":    res,
	})
}

func (uc *userController) changeDataUser(c *gin.Context) {
	var payload dto.DtoUpdateUser

	if err := c.ShouldBindJSON(&payload); err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": "make sure the value you input is correct"})
		return
	}

	var email any

	qryParam := c.Query("email")

	if qryParam == "" {
		email, _ = c.Get("userEmail")
	} else {
		email = qryParam
	}

	res, err := uc.userUc.ChangeDataUser(payload, email.(string))

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Succes Update Your Data",
		"Data":    res,
	})
}

func (uc *userController) getDoctor(c *gin.Context) {
	res, err := uc.userUc.GetDoctor()

	if err != nil {
		c.JSON(http.StatusOK, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"Message": "Success Get Doctor",
		"Data":    res,
	})
}

func (u *userController) changeEmailUser(c *gin.Context) {
	var NewEmail struct {
		Email string `json:"newEmail" binding:"required,email"`
	}

	if err := c.ShouldBindJSON(&NewEmail); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	id, _ := c.Get("userID")

	err := u.userUc.ChangeEmailUser(NewEmail.Email, id.(string))

	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"Error": err.Error()})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"Message": "success update your email"})
}

func (uc *userController) countUserByRole(c *gin.Context) {
	role := c.Param("role")

	res, err := uc.userUc.CountUserByRole(role)

	if err != nil {
		fmt.Println(err.Error())
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "success count data users", "totalData": res})
}

func (uc *userController) UserRouter() {
	r := uc.rg.Group("users")

	r.POST("", uc.authMiddleware.JwtVerify("Doctor", "Patient", "Admin"), uc.changePasswordUser)
	r.DELETE("", uc.authMiddleware.JwtVerify("Doctor", "Patient", "Admin"), uc.deleteUser)
	r.GET("", uc.authMiddleware.JwtVerify("Doctor", "Patient", "Admin"), uc.findUserByEmail)
	r.GET("find-email", uc.findUserByEmail)
	r.GET("find-user-by-role/:role", uc.authMiddleware.JwtVerify("Admin"), uc.findUserByRole)
	r.PUT("", uc.authMiddleware.JwtVerify("Doctor", "Patient", "Admin"), uc.changeDataUser)
	r.GET("doctors", uc.authMiddleware.JwtVerify("Patient", "Admin"), uc.getDoctor)
	r.PUT("emails", uc.authMiddleware.JwtVerify("Doctor", "Patient", "Admin"), uc.changeEmailUser)
	r.GET("count-data-user/:role", uc.authMiddleware.JwtVerify("Admin"), uc.countUserByRole)
}

func NewUserController(userUc usecase.UserUsecase, authMidd middleware.AuthMiddleware, rg *gin.RouterGroup) *userController {
	return &userController{
		userUc:         userUc,
		authMiddleware: authMidd,
		rg:             rg,
	}
}
