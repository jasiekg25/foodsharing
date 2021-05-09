# app/api/__init__.py


from flask_restx import Api

from app.api.auth import auth_namespace
from app.api.user_profile import user_profile_namespace
from app.api.tags import tags_namespace
from app.api.users import users_namespace
from app.api.orders import orders_namespace
from app.api.offers import offers_namespace

api = Api(version="1.0", title="FRED APIs", doc="/docs/")

api.add_namespace(auth_namespace, path="/auth")
api.add_namespace(users_namespace, path="/users")

api.add_namespace(orders_namespace, path="/orders")
api.add_namespace(offers_namespace, path="/offers")
api.add_namespace(tags_namespace, path="/tags")
api.add_namespace(user_profile_namespace, path="/user_profile")

