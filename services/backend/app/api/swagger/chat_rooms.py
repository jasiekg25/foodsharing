from datetime import datetime
import json
from flask import request, Response
from flask_restx import Resource, fields, Namespace, reqparse, inputs
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.chat_room import ChatRoom

chat_room_namespace = Namespace("chat_room")

chat_room = chat_room_namespace.model(
    "ChatRoom",
    {
        "id": fields.Integer(readOnly=True),
        "offer_owner": fields.Integer(readOnly=True),
        "client": fields.Integer(readOnly=True),
        "offer_id": fields.Integer(readOnly=True)
    }
)

class ChatRooms(Resource):
    @auth_required
    @chat_room_namespace.marshal_with(chat_room)
    def get(self):
        """Returns user's chat rooms """
        logger.info("ChatRoom.get()")
        try:
            user_id = current_user().id

            chat_rooms = ChatRoom.get_all_rooms(user_id)

            return [chat_room.to_dict() for chat_room in chat_rooms]

        except Exception as e:
            logger.exception("ChatRoom.get(): %s", str(e))
            return "Couldn't load chat rooms", 500

    @auth_required
    @chat_room_namespace.expect(chat_room)
    def post(self):
        """Place new chat room"""
        logger.info("ChatRoom.post() requested_body: %s", str(request.get_json()))
        try:
            content = request.get_json()

            for parameter in ['client', 'offer_id']:
                if parameter not in content:
                    return f"{parameter} missing in request", 400

            ChatRoom.add_chat_room(content['client'], content['offer_id'])

            return "Chat Room has been added", 201

        except Exception as e:
            logger.exception("ChatRoom.post(): %s", str(e))
            return "Couldn't add chat room", 500

chat_room_namespace.add_resource(ChatRooms, "")