package dto

import "github.com/Ak8388/applikasi-antrian-dokter-gigi/model"

type DcotorDto struct {
	Id          string `json:"id"`
	Name        string `json:"name"`
	Email       string `json:"email"`
	Address     any    `json:"address"`
	Photos      any    `json:"photos"`
	Age         any    `json:"age"`
	Degree      any    `json:"degree"`
	Description any    `json:"description"`
}

type DocterRegister struct {
	Doctor       model.Resgist      `json:"doctor"`
	DoctorDetail model.DoctorDetail `json:"doctorDetail"`
}
