# app/api/quotes.py
# APIs for quotes

from flask import request
from flask_restx import Resource, fields, Namespace
from app import db
from app.api.models import Author, Order

import random

# from app.api.utils import (
#     add_order,
# )

orders_namespace = Namespace("orders")

# this model does not have to match the database
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

class Orders(Resource):
    @orders_namespace.marshal_with(order)
    def get(self):
        """Returns all quotes with author info"""
        orders = Order.query.all()
        orders_list = []
        for q in orders:
            # to_dict() is a helper function in Order class in models.py
            orders_list.append(q.to_dict())
        return orders_list, 200


    @orders_namespace.expect(order, validate=True)
    @orders_namespace.response(201, "quote was added!")
    @orders_namespace.response(400, "Sorry, this quote already exists.")
    def post(self):
        """add a new quote"""
        post_data = request.get_json()
        # todo: Add all fields neccessary to add order (discuss with Mateusz)
        response_object = {}

        # add_order(user_id, offer_id, time, portions, accepted) # todo: Main logic for adding order should be in app/api/utils.py
        response_object["message"] = f"quote was added!"
        return response_object, 201