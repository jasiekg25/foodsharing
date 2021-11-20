from datetime import datetime
import json
from flask import request, Response
from flask_restx import Resource, fields, Namespace, reqparse, inputs
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.offer import Offer
from app.api.models.orders import Orders
from app.api.models.chat_message import ChatMessage
from app.api.models.chat_room import ChatRoom
# from app.api.swagger.chat_rooms import chat_room_namespace

individual_chat_namespace = Namespace("chat_rooms")
tags_fields = individual_chat_namespace.model(
    'Tags',
    {
        'tag_id': fields.Integer(readOnly=True),
        'tag_name': fields.String(readOnly=True)
    })

offer_search = individual_chat_namespace.model(
    "Offer",
    {
        "is_my_offer": fields.Boolean(readOnly=True),
        "id": fields.Integer(readOnly=True),
        "user_id": fields.String(readOnly=True),
        "user_name": fields.String(readOnly=True),
        "user_surname": fields.String(readOnly=True),
        "user_photo": fields.String(readOnly=True),
        "user_rating": fields.Float(readOnly=True),
        "name": fields.String(readOnly=True),
        "active": fields.Boolean(readOnly=True),
        "description": fields.String(readOnly=True),
        "photo": fields.String(readOnly=True),
        "portions_number": fields.Integer(readOnly=True),
        "used_portions": fields.Integer(readOnly=True),
        "pickup_longitude": fields.Float(readOnly=True),
        "pickup_latitude": fields.Float(readOnly=True),
        "post_time": fields.DateTime(readOnly=True),
        "pickup_times": fields.String(readOnly=True),
        "offer_expiry": fields.DateTime(readOnly=True),
        "tags": fields.List(fields.String(readOnly=True))
    },
)

order = individual_chat_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "fromUser_photo": fields.String(readOnly=True),
        "fromUser_name": fields.String(readOnly=True),
        "fromUser_surname": fields.String(readOnly=True),
        "fromUser_id": fields.Integer(readOnly=True),
        "fromUser_rating": fields.Float(readOnly=True),
        "offer_id": fields.Integer(readOnly=True),
        "offer_description": fields.String(readOnly=True),
        "offer_name": fields.String(readOnly=True),
        "portions": fields.Integer(readOnly=True),
        "is_canceled": fields.Boolean(readOnly=True),
        "is_picked": fields.Boolean(readOnly=True),
        "offer_photo": fields.String(readOnly=True),
        "tags": fields.List(fields.Nested(tags_fields))

    },
)

chat_message = individual_chat_namespace.model(
    "ChatMessages",
    {
        # "id": fields.Integer(readOnly=True),
        "from_user_id": fields.Integer(readOnly=True),
        # "chat_room_id": fields.Integer(readOnly=True),
        "message": fields.String(readOnly=True)
    }
)

chat = individual_chat_namespace.model(
    "Chat",
    {
        'offer' : fields.Nested(offer_search),
        'orders' : fields.List(fields.Nested(order)),
        'chat_messages' : fields.List(fields.Nested(chat_message))
    }
)

parser = reqparse.RequestParser()
parser.add_argument('chat_room_id', type=int)
parser.add_argument('page', type=int)

class ChatIndividual(Resource):
    @auth_required
    @individual_chat_namespace.marshal_with(chat)
    def get(self, chat_room_id):
        """Returns all messages in chat room (from both users)"""
        logger.info("Chat.get() chat_room_id: %s", str(chat_room_id))
        try:
            chat_room = ChatRoom.get_chat_room_by_id(chat_room_id)
            user_id = current_user().id

            messages = ChatMessage.get_all_messages(chat_room_id)
            offer = Offer.get_offer_by_id(chat_room.offer_id)
            orders = Orders.get_orders_by_offer_id(chat_room.offer_id)

            content = parser.parse_args()
            paginated_messages = messages.paginate(page=content['page'], per_page=20)
            try:
                paginated_messages = [message.to_dict() for message in paginated_messages.items]
            except:
                paginated_messages = []

            chat = {
                'offer': offer.to_chat_dict(user_id),
                'chat_messages': paginated_messages,
                'orders': [order.to_dict() for order in orders]
            }
            return chat

        except Exception as e:
            logger.exception("ChatMessage.get(): %s", str(e))
            return "Couldn't load chat messages", 500

    @auth_required
    @individual_chat_namespace.expect(chat_message)
    def post(self):
        """Place new message in chat room"""
        logger.info("Chat.post() requested_body: %s", str(request.get_json()))
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

individual_chat_namespace.add_resource(ChatIndividual, "/<int:chat_room_id>")