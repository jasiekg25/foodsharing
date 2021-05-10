from flask import request
from flask_restx import Resource, fields, Namespace
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models_old import User

user_profile_namespace = Namespace("user_profile")

# doing this add description to Swagger Doc
user_profile = user_profile_namespace.model(
    "User",
    {
        "id": fields.Integer(readOnly=True),
        "username": fields.String(readOnly=True),
        "name": fields.String(readOnly=True),
        "surname": fields.String(readOnly=True),
        "email": fields.String(readOnly=True),
        "profile_description": fields.String(readOnly=True),
        "profile_picture": fields.String(readOnly=True),
        "phone": fields.String(readOnly=True),
        "localization": fields.String(readOnly=True),
        "active": fields.Boolean(readOnly=True),
        "created_date": fields.DateTime(readOnly=True)
    }
)


class UserProfile(Resource):

    @auth_required
    @user_profile_namespace.marshal_with(user_profile)
    def get(self):
        """Returns user profile info"""
        logger.info("UserProfile.get() user_id: %s", str(current_user().id))
        try:
            user_id = current_user().id

            return User.get_user_profile_info(user_id), 200
        except Exception as e:
            logger.exception("UserProfile.get(): %s", str(e))
            return "Couldn't load user profile info", 500

    @auth_required
    def put(self):
        """Updates current user profile info"""
        logger.info("UserProfile.put() user_id: %s", str(current_user().id))
        try:
            user_id = current_user().id
            content = request.get_json()
            User.update_user_profile_info(user_id, content)
            return 'User profile info has been updated', 200
        except Exception as e:
            logger.exception("UserProfile.put(): %s", str(e))
            return "Couldn't update user profile info", 500


user_profile_namespace.add_resource(UserProfile, "")