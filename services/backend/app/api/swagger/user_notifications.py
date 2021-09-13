import json
from flask import request
from flask_restx import Resource, fields, Namespace
from flask_praetorian import current_user, auth_required
from app.api.models.user_notification import UserNotification
from app import logger

user_notifications = Namespace("user_notifications")

# doing this add description to Swagger Doc
user_notification = user_notifications.model(
    "UserNotification",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "message": fields.String(readOnly=True),
        "timestamp": fields.DateTime(readOnly=True),
        "chat_url": fields.String(readOnly=True)
    }
)


class UserNotifications(Resource):

    @auth_required
    @user_notifications.marshal_with(user_notification)
    def get(self):
        """Returns use notifications"""
        try:
            user_id = current_user().id
            logger.info("UserNotifications.get() user_id: %s", str(user_id))
            notifications = UserNotification.get_notifications(user_id)
            return [notif.to_dict() for notif in notifications], 200
        except Exception as e:
            logger.exception("UserNotifications.get(): %s", str(e))
            return "Couldn't load user notifications", 500


user_notifications.add_resource(UserNotifications, "")