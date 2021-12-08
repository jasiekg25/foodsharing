# app/tests/test_config.py


import os


def test_testing_config(test_app):
    test_app.config.from_object("app.tests.config.TestingConfig")
    assert test_app.config["SECRET_KEY"] == "change_this_to_some_random_key"
    assert test_app.config["TESTING"]
    assert not test_app.config["PRESERVE_CONTEXT_ON_EXCEPTION"]
    assert test_app.config["BCRYPT_LOG_ROUNDS"] == 13
    assert test_app.config["ACCESS_TOKEN_EXPIRATION"] == 900
    assert test_app.config["REFRESH_TOKEN_EXPIRATION"] == 2592000

