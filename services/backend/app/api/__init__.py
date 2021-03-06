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
from app.api.swagger.chat import individual_chat_namespace
from app.api.swagger.ping import ping_namespace


api = Api(version="1.0", title="FOODSHARING APIs", doc="/docs/")

api.add_namespace(ping_namespace, path='/ping')
api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(users_namespace, path="/users")
api.add_namespace(orders_namespace, path="/orders")
api.add_namespace(offers_namespace, path="/offers")
api.add_namespace(tags_namespace, path="/tags")

api.add_namespace(user_profile_namespace, path="/user/profile")
api.add_namespace(profile_orders_namespace, path="/user/profile/orders")
api.add_namespace(offers_current_namespace, path="/user/profile/offers")
api.add_namespace(chat_room_namespace, path="/user/chat_rooms")
api.add_namespace(individual_chat_namespace, path="/user/chat_rooms") # individual chat data
api.add_namespace(user_notifications, path="/user/notifications")
api.add_namespace(rating_namespace, path="/user/rating")
