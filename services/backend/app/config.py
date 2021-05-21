# app/config.py


import os


class BaseConfig:
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "change_this_to_some_random_key"
    JWT_ACCESS_LIFESPAN = {'minutes': 15}
    JWT_REFRESH_LIFESPAN = {'days': 30}
    
    MAIL_SERVER = 'smtp.gmail.com'
    MAIL_USERNAME = 'bob.battleship@gmail.com'
    MAIL_DEFAULT_SENDER = 'SchabCoin'
    MAIL_PASSWORD = 'g425g356hwdhsfduy456u534dsgh654ujhfgd'
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_PORT = 465
    
    PRAETORIAN_CONFIRMATION_URI = 'http://localhost:3007/finalize'
    PRAETORIAN_CONFIRMRATION_SENDER = 'SchabCoin'


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")
    JWT_ACCESS_LIFESPAN = {'seconds': 3}
    JWT_REFRESH_LIFESPAN = {'seconds': 3}


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
