# app/api/__init__.py


from flask_restx import Api

from app.api.swagger.auth import auth_namespace
from app.api.swagger.rating import rating_namespace
from app.api.swagger.user_notifications import user_notifications
from app.api.swagger.user_profile import user_profile_namespace
from app.api.swagger.tags import tags_namespace
from app.api.swagger.users import users_namespace
from app.api.swagger.orders import orders_namespace
from app.api.swagger.offers import offers_namespace
from app.api.swagger.profile_current_offers import offers_current_namespace
from app.api.swagger.profile_orders import profile_orders_namespace
from app.api.swagger.chat_rooms import chat_room_namespace
from app.api.swagger.chat_messages import chat_message_namespace


api = Api(version="1.0", title="FRED APIs", doc="/docs/")

api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(users_namespace, path="/users")

api.add_namespace(orders_namespace, path="/orders")
api.add_namespace(offers_namespace, path="/offers")
api.add_namespace(tags_namespace, path="/tags")
api.add_namespace(user_profile_namespace, path="/user_profile")
api.add_namespace(offers_current_namespace, path="/current_offers")
api.add_namespace(profile_orders_namespace, path="/profile_orders")
api.add_namespace(chat_room_namespace, path="/chat_rooms")
api.add_namespace(chat_message_namespace, path="/chat_messages")
api.add_namespace(user_notifications, path="/user_notifications")
api.add_namespace(rating_namespace, path="/rating")
