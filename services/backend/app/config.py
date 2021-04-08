# app/config.py


import os


class BaseConfig:
    TESTING = False
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = "change_this_to_some_random_key"
    JWT_ACCESS_LIFESPAN = {'minutes': 15}
    JWT_REFRESH_LIFESPAN = {'days': 30}


class DevelopmentConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
    JWT_ACCESS_LIFESPAN = {'seconds': 10}
    JWT_REFRESH_LIFESPAN = {'seconds': 20}


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")
    BCRYPT_LOG_ROUNDS = 4
    ACCESS_TOKEN_EXPIRATION = 3
    REFRESH_TOKEN_EXPIRATION = 3


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
