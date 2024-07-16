package common

import (
	"errors"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/config"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	utilsmodel "github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/utils_model"
	"github.com/golang-jwt/jwt/v5"
)

type JwtToken interface {
	GenerateToken(id, email, role, name string) (model.TokenAkses, error)
	VerfifyToken(model model.TokenAkses) (jwt.MapClaims, error)
}

type jwtToken struct {
	cfg *config.JWTConfig
}

func (j *jwtToken) GenerateToken(id, email, role, name string) (model.TokenAkses, error) {
	var payloadToken model.TokenAkses

	claims := utilsmodel.JWTClaims{
		RegisteredClaims: jwt.RegisteredClaims{
			Issuer:    j.cfg.IssuerName,
			ExpiresAt: jwt.NewNumericDate(time.Now().Add(j.cfg.TokenLifeTime * time.Hour)),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
		Email: email,
		Role:  role,
		Name:  name,
		Id:    id,
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)

	sigToken, err := token.SignedString(j.cfg.SecretKey)

	if err != nil {
		return model.TokenAkses{}, errors.New("failed signed token")
	}

	payloadToken.Token = sigToken

	return payloadToken, nil
}

func (j *jwtToken) VerfifyToken(model model.TokenAkses) (jwt.MapClaims, error) {
	token, err := jwt.Parse(model.Token, func(t *jwt.Token) (interface{}, error) {
		if t.Method != jwt.GetSigningMethod("HS256") {
			return nil, errors.New("token methode not match")
		}

		return j.cfg.SecretKey, nil
	})

	if err != nil {
		return nil, err
	}

	mapClaims, ok := token.Claims.(jwt.MapClaims)

	if !token.Valid || !ok {
		return nil, errors.New("token not valid")
	}

	return mapClaims, nil
}

func NewJwtToken(cfg *config.JWTConfig) JwtToken {
	return &jwtToken{cfg}
}
