# app/__init__.py


import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_praetorian import Praetorian
import logging
from logging.handlers import RotatingFileHandler


# instantiate the extensions
db = SQLAlchemy()
cors = CORS()
guard = Praetorian()
logger = logging.getLogger(__name__)

def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    # set up extensions
    db.init_app(app)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    logger.setLevel(logging.DEBUG)
    handler = RotatingFileHandler('./logs/application.log', maxBytes=1024)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)

    from .api.models_old import User
    guard.init_app(app, User)


    # register api
    from app.api import api

    api.init_app(app)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
