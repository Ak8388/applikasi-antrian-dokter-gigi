package middleware

import (
	"net/http"
	"strings"
	"time"

	"github.com/Ak8388/applikasi-antrian-dokter-gigi/model"
	"github.com/Ak8388/applikasi-antrian-dokter-gigi/utils/common"
	"github.com/gin-gonic/gin"
)

type AuthMiddleware interface {
	JwtVerify(role ...string) gin.HandlerFunc
	GetRole(payloadToken model.TokenAkses) string
}

type authMiddleware struct {
	jwtCommon common.JwtToken
}

func (am *authMiddleware) JwtVerify(role ...string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authorization := ctx.Request.Header.Get("Authorization")
		tokenString := strings.Replace(authorization, "Bearer ", "", -1)

		payloadToken := model.TokenAkses{
			Token: tokenString,
		}

		claims, err := am.jwtCommon.VerfifyToken(payloadToken)

		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		validateRole := false

		for _, x := range role {
			if x == claims["Role"].(string) {
				validateRole = true
			}
		}

		if !validateRole {
			ctx.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "can't akses this page. invalid role"})
			return
		}

		exp := claims["exp"].(float64)

		if time.Now().After(time.Unix(int64(exp), 10)) {
			ctx.AbortWithStatusJSON(419, gin.H{"error": "Hey, your session has ended"})
			return
		}

		ctx.Set("userEmail", claims["Email"].(string))
		ctx.Set("userRole", claims["Role"].(string))
		ctx.Set("userID", claims["Id"].(string))
		ctx.Next()
	}
}

func (am *authMiddleware) GetRole(payloadToken model.TokenAkses) string {
	claims, _ := am.jwtCommon.VerfifyToken(payloadToken)

	return claims["Role"].(string)
}

func NewAuthMiddleware(cmJwt common.JwtToken) AuthMiddleware {
	return &authMiddleware{cmJwt}
}
