# app/__init__.py


import os
import datetime
import jwt

from flask import current_app
from sqlalchemy.sql import func
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_bcrypt import Bcrypt
import flask_praetorian
from .config import DevelopmentConfig


# instantiate the extensions
db = SQLAlchemy()
cors = CORS()
bcrypt = Bcrypt()
guard = flask_praetorian.Praetorian()


def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(DevelopmentConfig)

    # set up extensions
    db.init_app(app)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    bcrypt.init_app(app)
    
    from .api.models import User
    guard.init_app(app, User)


    # register api
    from app.api import api

    api.init_app(app)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
