from datetime import datetime

from flask import request
from flask_restx import Resource, fields, Namespace, reqparse
from flask_praetorian import current_user, auth_required
from flask_mail import Message
import jinja2


from app import logger, mail
from app.api.models.offer import Offer
from app.api.models.orders import Orders
from app.api.models.user import User

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
        "is_canceled": fields.Boolean(readOnly=True),
        "is_picked": fields.Boolean(readOnly=True)
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


parser = reqparse.RequestParser()

class OrdersNamespace(Resource):
    @orders_namespace.expect(parser)
    @orders_namespace.marshal_with(order)
    def get(self):
        """Returns all orders"""
        logger.info("Orders.get()")
        try:
            orders = Orders.get_all_orders()
            return [order.to_dict() for order in orders], 200

        except Exception as e:
            logger.exception("Orders.get(): %s", str(e))
            return "Couldn't load orders", 500

    @auth_required
    @orders_namespace.expect(order, validate=True)
    def post(self):
        """Place new order"""
        logger.info("Orders.post() request_body: %s", str(request.get_json()))
        try:
            content = request.get_json()
            offer_from_order = Offer.get_offer_by_id(content['offer_id'])
            offer_dict = offer_from_order.to_dict()

            user_id = current_user().id

            if offer_dict['portions_number'] - offer_dict['used_portions'] < content['portions']:
                return "Not enough portions", 400

            if not offer_dict['active']:
                return "Offer not active any more", 400

            if offer_dict['offer_expiry'] < datetime.now():
                return "Offer expired", 400

            new_order_portion = content['portions'] + offer_dict['used_portions']
            Offer.update_used_portions(content['offer_id'], new_order_portion)

            Orders.add_order(user_id, content['offer_id'], datetime.now(), content['portions'])
            
            try:
                offer = Offer.query.filter_by(id=content['offer_id']).first()
                author = User.query.filter_by(id=offer.user_id).first()
                
                with open('./templates/order_notification.html') as file:
                    template = file.read()

                data = {
                    'offer_name': offer.name.title(), 
                    'portions': content['portions'],
                    'author': author.name.title(),
                    'order_url': 'http://localhost:3007/' # TODO put real url for chat
                }
                
                logger.info(data)
                jinja_tmpl = jinja2.Template(template)
                message = jinja_tmpl.render(data).strip()
                
                msg = Message(
                    subject="New Order",
                    html=message,
                    recipients=[author.email]
                )
                mail.send(msg)
            except Exception as e:
                logger.exception("Order Email Notification: %s", str(e))
            
            from flask_socketio import emit
            message = f"Someone just ordered {data['portions']} of {data['offer_name']}!"
            emit('notification', {'notification': {"message": message, "url": data['order_url']}}, room=f'user_{author.id}', namespace="/notifs")
            
            return "Order placed", 201

        except Exception as e:
            logger.exception("Orders.post(): %s", str(e))
            return "Couldn't make order", 500

orders_namespace.add_resource(OrdersNamespace, "")