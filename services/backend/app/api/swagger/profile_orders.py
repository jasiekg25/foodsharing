from datetime import datetime

from flask import request
from flask_restx import Resource, fields, Namespace, reqparse
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.offer import Offer
from app.api.models.order import Order

profile_orders_namespace = Namespace("profile_orders")
offers_namespace = Namespace("offers")

# doing this add description to Swagger Doc
order = profile_orders_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "offer_id": fields.Integer(readOnly=True),
        "time": fields.DateTime(readOnly=True),
        "portions": fields.Integer(readOnly=True),
        "accepted": fields.Boolean(readOnly=True),
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


class Orders(Resource):
    @auth_required
    @profile_orders_namespace.marshal_with(order)
    def get(self):
        """Returns all orders"""
        logger.info("Orders.get()")
        try:
            user_id = current_user().id
            orders =  Order.get_orders_of_user(user_id=user_id)


            return [order.to_dict() for order in orders], 200
        except Exception as e:
            logger.exception("Orders.get(): %s", str(e))
            return "Couldn't load orders", 500



profile_orders_namespace.add_resource(Orders, "")