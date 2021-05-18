# app/api/__init__.py


from flask_restx import Api

from app.api.swagger.auth import auth_namespace
from app.api.swagger.user_profile import user_profile_namespace
from app.api.swagger.tags import tags_namespace
from app.api.swagger.users import users_namespace
from app.api.swagger.orders import orders_namespace
from app.api.swagger.offers import offers_namespace
from app.api.swagger.offers_search import offers_search_namespace
from app.api.swagger.profile_current_offers import offers_current_namespace
from app.api.swagger.profile_orders import profile_orders_namespace


api = Api(version="1.0", title="FRED APIs", doc="/docs/")

api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(users_namespace, path="/users")

api.add_namespace(orders_namespace, path="/orders")
api.add_namespace(offers_namespace, path="/offers")
api.add_namespace(tags_namespace, path="/tags")
api.add_namespace(user_profile_namespace, path="/user_profile")
api.add_namespace(offers_search_namespace, path="/search_offers")
api.add_namespace(offers_current_namespace, path="/current_offers")
api.add_namespace(profile_orders_namespace, path="/profile_orders")

