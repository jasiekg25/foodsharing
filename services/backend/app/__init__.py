# app/__init__.py


import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_praetorian import Praetorian, auth_required, current_user
import logging
from logging.handlers import RotatingFileHandler
from flask_mail import Mail
from flask_socketio import SocketIO, send, join_room, emit
import cloudinary
import cloudinary.uploader as cloudinary_uploader
from flask import request


# instantiate the extensions
db = SQLAlchemy()
cors = CORS()
guard = Praetorian()
logger = logging.getLogger(__name__)
mail = Mail()


cloudinary = cloudinary.config(
    cloud_name=os.environ['CLOUDINARY_CLOUD_NAME'],
    api_key=os.environ['CLOUDINARY_API_KEY'],
    api_secret=os.environ['CLOUDINARY_API_SECRET']
)




def create_app(script_info=None):

    # instantiate the app
    app = Flask(__name__)

    # set sockerIo
    # socketio = SocketIO(app, engineio_logger=True, logger=True, cors_allowed_origins="*", resource="/chat")
    socketio = SocketIO(app, engineio_logger=True, logger=True, cors_allowed_origins="*")

    # set config
    app_settings = os.getenv("APP_SETTINGS")
    app.config.from_object(app_settings)

    @socketio.on("message")
    def handleMessage(msg):
        print(msg)
        send(msg, broadcast=True)
        return None

    @socketio.on('connect', namespace="/notifs")
    def connect_handler():
        pass

    @socketio.on('auth', namespace="/notifs")
    def connect_handler(msg):
        token = msg['accessToken']
        user_id = guard.extract_jwt_token(token)["id"]
        user_room = f'user_{user_id}'
        join_room(user_room)
        emit('response', {'meta': f"{user_id}"})

    # set up extensions
    db.init_app(app)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    logger.setLevel(logging.DEBUG)
    handler = RotatingFileHandler('./logs/application.log', maxBytes=1024)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    mail.init_app(app)

    from .api.models.client_rating import ClientRating
    from .api.models.offer import Offer
    from .api.models.orders import Orders
    from .api.models.sharer_rating import SharerRating
    from .api.models.tag import Tag
    from .api.models.chat_room import ChatRoom
    from .api.models.chat_message import ChatMessage

    from .api.models.user import User
    guard.init_app(app, User)


    # register api
    from app.api import api

    api.init_app(app)

    # shell context for flask cli
    @app.shell_context_processor
    def ctx():
        return {"app": app, "db": db}

    return app
