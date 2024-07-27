package dto

import "time"

type Login struct {
	Email    string `json:"email" binding:"required"`
	Password string `json:"password" binding:"required"`
	Name     string `json:"name"`
	ID       string `json:"id"`
	Role     string `json:"role"`
}

type ResgistResponse struct {
	Id        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	CreatedAt time.Time `json:"createdAt"`
	UpdateAt  time.Time `json:"updateAt"`
}

type ResponseFindUser struct {
	ID        string    `json:"id"`
	Name      string    `json:"name"`
	Email     string    `json:"email"`
	Address   any       `json:"address"`
	Role      string    `json:"role"`
	CreatedAt time.Time `json:"createdAt"`
	UpdateAt  time.Time `json:"updateAt"`
}

type DtoUpdateUser struct {
	Name    string `json:"name"`
	Email   string `json:"email"`
	Address any    `json:"address"`
}

type DtoChangePassword struct {
	OldPassword string `json:"oldPass"`
	Password    string `json:"newPass"`
}
