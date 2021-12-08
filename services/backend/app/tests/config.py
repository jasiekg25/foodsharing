import os

class TestingConfig():
    TESTING = True
    SECRET_KEY = "change_this_to_some_random_key"
    SQLALCHEMY_DATABASE_URI = "postgresql://postgres:postgres@db:5432/app_test"
    BCRYPT_LOG_ROUNDS = 13
    ACCESS_TOKEN_EXPIRATION = 900
    REFRESH_TOKEN_EXPIRATION = 2592000