package driver

import (
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/config"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/controller"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/driver/middleware"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/manager"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/common"
	"github.com/gin-gonic/gin"
)

type serverRequirment struct {
	engine  *gin.Engine
	manager manager.UsecaseManager
	config  config.Config
	jwtAuth common.JwtToken
	host    string
}

func (sr *serverRequirment) setUpController() {
	rg := sr.engine.Group("api-klinik-gigi-vony-nur-santy")

	am := middleware.NewAuthMiddleware(sr.jwtAuth)

	// auth controller
	controller.NewAuthController(sr.manager.AuthUsecase(), am, rg).Router()
	// user controller
	controller.NewUserController(sr.manager.UserUsecase(), am, rg).UserRouter()
	// queue controller
	controller.NewQueueController(sr.manager.QueueUsecase(), am, rg).QueueRouter()
	// schedule controller
	controller.NewScheduleDoctor(sr.manager.ScheduleDoctor(), am, rg).ScheduleRouter()
	// doctor controller
	controller.NewDoctorController(sr.manager.Doctor(), am, rg).DoctorsRouter()
	// doctor days off
	controller.NewDayOffController(am, rg, sr.manager.DoctorDayOff()).DaysOffRouter()
}

func (sr *serverRequirment) Run() {
	sr.setUpController()

	if err := sr.engine.Run(":" + sr.host); err != nil {
		panic(err)
	}
}

func NewServer() *serverRequirment {
	eng := gin.Default()
	cfg := config.Cfg()
	jwt := common.NewJwtToken(&cfg.JWTConfig)
	infra := manager.NewInfraManager(cfg)
	rm := manager.NewRepoManager(infra, jwt)
	usM := manager.NewUsecaseManager(jwt, rm)
	middleware.AddCors(eng)

	return &serverRequirment{
		engine:  eng,
		manager: usM,
		config:  *cfg,
		jwtAuth: jwt,
		host:    cfg.APIPort,
	}
}
