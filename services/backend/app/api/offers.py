# app/api/quotes.py
# APIs for quotes

from flask import request
from flask_restx import Resource, fields, Namespace
from app import db
from app.api.models import Author, Offer

import random

# from app.api.utils import (
#     add_offer,
# )

offers_namespace = Namespace("offers")

# this model does not have to match the database
# doing this add description to Swagger Doc
offer = offers_namespace.model(
    "Offer",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.Integer(readOnly=True),
        "name":  fields.String(readOnly=True),
        "active":  fields.Boolean(readOnly=True),
        "description":  fields.Text(readOnly=True),
        "photo":  fields.String(readOnly=True),
        "portions_number":  fields.Integer(readOnly=True),
        "used_portions":  fields.Integer(readOnly=True),
        "pickup_localizations":  fields.String(readOnly=True),
        "post_time":  fields.DataTime(readOnly=True),
        "pickup_times":  fields.String(readOnly=True),
        "offer_expiry":  fields.DataTime(readOnly=True),
    },
)

class Offers(Resource):

    @offers_namespace.marshal_with(offer)
    def get(self):
        """Returns all quotes with author info"""
        offers = Offer.query.all()
        offers_list = []
        for q in offers:
            # to_dict() is a helper function in Quote class in models.py
            offers_list.append(q.to_dict())
        return offers_list, 200


    @offers_namespace.expect(offer, validate=True)
    @offers_namespace.response(201, "quote was added!")
    @offers_namespace.response(400, "Sorry, this quote already exists.")
    def post(self):
        """add a new quote"""
        post_data = request.get_json()
        content = post_data.get("content")
        author_name = post_data.get("author_name")
        response_object = {}

        # add_offer(PARAMETERS) # todo: Implement add_offer
        response_object["message"] = f"quote was added!"
        return response_object, 201
