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


class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_TEST_URL")
    JWT_ACCESS_LIFESPAN = {'seconds': 3}
    JWT_REFRESH_LIFESPAN = {'seconds': 3}


class ProductionConfig(BaseConfig):
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL")
