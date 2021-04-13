from datetime import datetime

from flask import request
from flask_restx import Resource, fields, Namespace
from flask_praetorian import current_user, auth_required

from app.api.data_access.offers_utils import get_offer_by_id, update_used_portions
from app.api.data_access.orders_utils import get_all_orders, add_order

orders_namespace = Namespace("orders")
offers_namespace = Namespace("offers")

# doing this add description to Swagger Doc
order = orders_namespace.model(
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
    @orders_namespace.marshal_with(order)
    def get(self):
        """Returns all orders"""
        try:
            orders = get_all_orders()

            return [order.to_dict() for order in orders], 200
        except Exception:
            return "Couldn't load orders", 500

    @auth_required
    @orders_namespace.expect(order, validate=True)
    def post(self):
        """Place new order"""
        try:
            content = request.get_json()
            offer_from_order = get_offer_by_id(content['offer_id'])
            offer_dict = offer_from_order.to_dict()

            user_id = current_user().id

            if offer_dict['portions_number'] - offer_dict['used_portions'] < content['portions']:
                return "Not enough portions", 400

            if not offer_dict['active']:
                return "Offer not active any more", 400

            if offer_dict['offer_expiry'] < datetime.now():
                return "Offer expired", 400

            new_order_portion = content['portions'] + offer_dict['used_portions']
            update_used_portions(content['offer_id'], new_order_portion)

            add_order(user_id, content['offer_id'], datetime.now(), 1)

            return "Order placed", 201

        except Exception:
            return "Couldn't make order", 500


orders_namespace.add_resource(Orders, "")