from datetime import datetime
import json
from flask import request, Response
from flask_restx import Resource, fields, Namespace, reqparse, inputs
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.chat_message import ChatMessage

chat_message_namespace = Namespace("chat_message")

chat_message = chat_message_namespace.model(
    "ChatMessages",
    {
        "id": fields.Integer(readOnly=True),
        "from_user_id": fields.Integer(readOnly=True),
        "chat_room_id": fields.Integer(readOnly=True),
        "message": fields.String(readOnly=True)
    }
)

parser = reqparse.RequestParser()
parser.add_argument('chat_room_id', type=int)

class ChatMessages(Resource):
    @auth_required
    @chat_message_namespace.marshal_with(chat_message)
    def get(self):
        """Returns all messages in chat room (from both users)"""
        logger.info("ChatMessage.get()")
        try:
            content = parser.parse_args()
            chat_room_id = content['chat_room_id']

            messages = ChatMessage.get_all_messages(chat_room_id)

            return [message.to_dict() for message in messages]

        except Exception as e:
            logger.exception("ChatMessage.get(): %s", str(e))
            return "Couldn't load chat messages", 500

    @auth_required
    @chat_message_namespace.expect(chat_message)
    def post(self):
        """Place new message in chat room"""
        logger.info("ChatMessage.post() requested_body: %s", str(request.get_json()))
        try:
            content = request.get_json()
            user_id = current_user().id

            for parameter in ['chat_room_id', 'message']:
                if parameter not in content:
                    return f"{parameter} missing in request", 400

            ChatMessage.add_chat_message(user_id, content['chat_room_id'],  content['message'])

            return "Chat Message has been added", 201

        except Exception as e:
            logger.exception("ChatMessage.post(): %s", str(e))
            return "Couldn't add chat room", 500

chat_message_namespace.add_resource(ChatMessages, "")