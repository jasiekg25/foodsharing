from datetime import datetime

from flask import request, Response
from flask_restx import Resource, fields, Namespace

from app.api.data_access.offers_utils import get_all_offers, add_offer


offers_namespace = Namespace("offers")

# doing this add description to Swagger Doc
offer = offers_namespace.model(
    "Offer",
    {
        "id": fields.Integer(readOnly=True),
        "user_name": fields.String(readOnly=True),
        "name":  fields.String(readOnly=True),
        "active":  fields.Boolean(readOnly=True),
        "description":  fields.String(readOnly=True),
        "photo":  fields.String(readOnly=True),
        "portions_number":  fields.Integer(readOnly=True),
        "used_portions":  fields.Integer(readOnly=True),
        "pickup_localizations":  fields.String(readOnly=True),
        "post_time":  fields.DateTime(readOnly=True),
        "pickup_times":  fields.String(readOnly=True),
        "offer_expiry":  fields.DateTime(readOnly=True),
    },
)


class Offers(Resource):

    @offers_namespace.marshal_with(offer)
    def get(self):
        """Returns all offers with user info"""
        try:
            add_offer(1, "Test", 3, 0, '2314', datetime.utcnow(), '12414', datetime.utcnow())
            offers = get_all_offers()

            return [offer.to_dict() for offer in offers], 200
        except Exception:
            return "Couldn't load offers", 500

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

offers_namespace.add_resource(Offers, "")