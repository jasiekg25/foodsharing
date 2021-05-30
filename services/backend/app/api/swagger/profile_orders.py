from datetime import datetime

from flask import request
from flask_restx import Resource, fields, Namespace, reqparse
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.offer import Offer
from app.api.models.orders import Orders

profile_orders_namespace = Namespace("profile_orders")
offers_namespace = Namespace("offers")

# doing this add description to Swagger Doc
order = profile_orders_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "fromUser_name": fields.String(readOnly=True),
        "fromUser_surname": fields.String(readOnly=True),
        "fromUser_id": fields.Integer(readOnly=True),
        "offer_id": fields.Integer(readOnly=True),
        "offer_description": fields.String(readOnly=True),
        "offer_name": fields.String(readOnly=True),
        "portions": fields.Integer(readOnly=True),
        "is_canceled": fields.Boolean(readOnly=True),
        "is_picked": fields.Boolean(readOnly=True),
        "offer_photo": fields.String(readOnly=True),
    },
)

offer = offers_namespace.model(
    "Offer",
    {
        "id": fields.Integer(readOnly=True),
        "user_name": fields.String(readOnly=True),
        "active":  fields.Boolean(readOnly=True),
        "portions_number":  fields.Integer(readOnly=True),
        "used_portions":  fields.Integer(readOnly=False),
        "offer_expiry":  fields.DateTime(readOnly=True),
    },
)


class OrdersNamespace(Resource):
    @auth_required
    @profile_orders_namespace.marshal_with(order)
    def get(self):
        """Returns all orders"""
        logger.info("Orders.get()")
        try:
            user_id = current_user().id
            orders =  Orders.get_orders_of_user(user_id=user_id)


            return [order.to_dict() for order in orders], 200
        except Exception as e:
            logger.exception("Orders.get(): %s", str(e))
            return "Couldn't load orders", 500



profile_orders_namespace.add_resource(OrdersNamespace, "")