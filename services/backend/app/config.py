# app/config.py


import os


class BaseConfig:
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_ACCESS_LIFESPAN = {'minutes': 150}
    JWT_REFRESH_LIFESPAN = {'days': 30}
    
    MAIL_SERVER = os.environ.get("MAIL_SERVER")
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME")
    MAIL_DEFAULT_SENDER = os.environ.get("DEFAULT_COMPANY_NAME")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD")
    MAIL_USE_TLS = False
    MAIL_USE_SSL = True
    MAIL_PORT = 465
    
    PRAETORIAN_CONFIRMATION_URI = 'http://localhost:3007/finalize'
    PRAETORIAN_CONFIRMRATION_SENDER = os.environ.get("DEFAULT_COMPANY_NAME")


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")
    JWT_ACCESS_LIFESPAN = {'seconds': 3}
    JWT_REFRESH_LIFESPAN = {'seconds': 3}


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    JWT_ACCESS_LIFESPAN = {'days': 150}
    JWT_REFRESH_LIFESPAN = {'days': 30}
