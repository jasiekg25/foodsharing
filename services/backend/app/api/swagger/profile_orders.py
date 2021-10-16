from datetime import datetime

from flask import request
from flask_restx import Resource, fields, Namespace, reqparse
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.offer import Offer
from app.api.models.orders import Orders
from app.api.models.user_notification import emit_and_safe_notification

profile_orders_namespace = Namespace("profile_orders")
offers_namespace = Namespace("offers")

# doing this add description to Swagger Doc
order = profile_orders_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "fromUser_photo": fields.String(readOnly=True),
        "fromUser_name": fields.String(readOnly=True),
        "fromUser_surname": fields.String(readOnly=True),
        "fromUser_id": fields.Integer(readOnly=True),
        "fromUser_rating": fields.Integer(readOnly=True),
        "offer_id": fields.Integer(readOnly=True),
        "offer_description": fields.String(readOnly=True),
        "offer_name": fields.String(readOnly=True),
        "portions": fields.Integer(readOnly=True),
        "is_canceled": fields.Boolean(readOnly=True),
        "is_picked": fields.Boolean(readOnly=True),
        "offer_photo": fields.String(readOnly=True),
    },
)

order_post = profile_orders_namespace.model(
    "Order",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "fromUser_photo": fields.String(readOnly=True),
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

    @auth_required
    @profile_orders_namespace.expect(order_post)
    def put(self):
        """Updates current user order"""
        logger.info("Orders.put() user_id: %s", str(current_user().id))
        try:
            user_id = current_user().id
            content = request.get_json()
            current_order = Orders.get_order_by_id(content['id']).to_dict()
            Orders.update_order(content)
            offer = Offer.query.filter_by(id=content['offer_id']).first()
            offer_title = offer.name.title()
            author_id = offer.user_id

            if content['is_canceled'] and not current_order['is_canceled']:
                message = f'Your order for {offer_title} has been canceled'
                emit_and_safe_notification(author_id, message, content['offer_id'])
                message = f'You canceled order for {offer_title}'
                emit_and_safe_notification(user_id, message, content['offer_id'])

            if content['is_picked'] and not current_order['is_picked']:
                message = f'Your order for {offer_title} has been picked'
                emit_and_safe_notification(author_id, message, content['offer_id'])
                message = f'You picked your order {offer_title}'
                emit_and_safe_notification(user_id, message, content['offer_id'])
            return 'User order has been updated', 200
        except Exception as e:
            logger.exception("Order.put(): %s", str(e))
            return "Couldn't update user's order", 500



profile_orders_namespace.add_resource(OrdersNamespace, "")