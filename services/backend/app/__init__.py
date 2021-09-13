# app/__init__.py


import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_praetorian import Praetorian, auth_required, current_user
from flask_praetorian.exceptions import ExpiredAccessError
import logging
from logging.handlers import RotatingFileHandler
from flask_mail import Mail
from flask_socketio import SocketIO, send, emit, join_room, leave_room
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



    # chat socket start
    @socketio.on('connect', namespace="/chat")
    def connect_handler():
        logger.info("CONNECTED to chat websocket")

    @socketio.on('join_room', namespace="/chat")
    def join_room_handler(msg):
        logger.info("JOINED to room; request_body: %s", str(request.get_json()))

        room_id = msg['roomId']
        join_room(room_id)

        emit('response', {'meta': f"{room_id}"})

    @socketio.on('leave_room', namespace="/chat")
    def leave_room_handler(msg):
        logger.info("LEFT the chat room; request_body: %s", str(request.get_json()))
        room_id = msg['room_id']
        leave_room(room_id)


    @socketio.on("message", namespace="/chat")
    def message_handler(msg):

        token = msg['accessToken']
        user_id = guard.extract_jwt_token(token)["id"]
        room_id = msg["roomId"]
        message = msg["message"]['message']

        ChatMessage.add_chat_message(chat_room_id=room_id, message=message, from_user_id=user_id)

        send(msg, namespace="/chat", to=room_id)
        return None

    # chat socket end

    # notification's socket start
    @socketio.on('auth', namespace="/notifs")
    def auth_handler(msg):
        token = msg['accessToken']
        user_id = None
        user_room = None
        try:
            user_id = guard.extract_jwt_token(token)["id"]
            user_room = f'user_{user_id}'
            join_room(user_room)
        except ExpiredAccessError:
            print('DUPA')
        except Exception as e:
            logger.error(e)
        finally:
            emit('response', {'meta': f"{user_id}"}, room=user_room, namespace="/notifs")

    def send_notificatin(message, user_id):
        emit('notification', {'notification': message}, room=f'user_{user_id}', namespace="/notifs")

    # notification's socket end

    # set up extensions
    db.init_app(app)
    cors.init_app(app, resources={r"*": {"origins": "*"}})
    formatter = logging.Formatter('%(asctime)s %(levelname)s %(message)s')
    logger.setLevel(logging.DEBUG)
    handler = RotatingFileHandler('./logs/application.log', maxBytes=1024)
    handler.setFormatter(formatter)
    app.logger.addHandler(handler)
    mail.init_app(app)

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
