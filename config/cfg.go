package config

import (
	"errors"
	"os"
	"strconv"
	"time"

	"github.com/joho/godotenv"
)

type DBConfig struct {
	DBUser   string
	DBPass   string
	DBName   string
	DBPort   string
	DBDriver string
}

type JWTConfig struct {
	IssuerName    string
	SecretKey     []byte
	TokenLifeTime time.Duration
}

type APIConfig struct {
	APIPort string
}

type Config struct {
	DBConfig
	JWTConfig
	APIConfig
}

func (cfg *Config) readConfig() error {

	if err := godotenv.Load(); err != nil {
		return errors.New("failed read config from environtment")
	}

	tokenLifeTime, _ := strconv.Atoi(os.Getenv("TOKEN_LIFE_TIME"))

	cfg.DBConfig = DBConfig{
		DBUser:   os.Getenv("DB_USER"),
		DBPass:   os.Getenv("DB_PASS"),
		DBName:   os.Getenv("DB_NAME"),
		DBPort:   os.Getenv("DB_PORT"),
		DBDriver: os.Getenv("DB_DRIVER"),
	}

	cfg.JWTConfig = JWTConfig{
		IssuerName:    os.Getenv("ISSUER_NAME"),
		SecretKey:     []byte(os.Getenv("SECRET_KEY")),
		TokenLifeTime: time.Duration(tokenLifeTime),
	}

	cfg.APIConfig = APIConfig{
		APIPort: os.Getenv("API_PORT"),
	}

	if cfg.DBUser == "" || cfg.DBPass == "" || cfg.DBName == "" || cfg.DBPort == "" || cfg.DBDriver == "" || cfg.IssuerName == "" || cfg.SecretKey == nil || cfg.TokenLifeTime == 0 || cfg.APIPort == "" {
		return errors.New("all environtments required")
	}

	return nil
}

func Cfg() *Config {
	cfg := &Config{}

	if err := cfg.readConfig(); err != nil {
		panic(err)
	}

	return cfg
}
