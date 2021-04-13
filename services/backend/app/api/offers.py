from datetime import datetime

from flask import request, Response
from flask_restx import Resource, fields, Namespace
from flask_praetorian import current_user, auth_required
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
        "pickup_localization":  fields.String(readOnly=True),
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
            offers = get_all_offers()

            return [offer.to_dict() for offer in offers], 200
        except Exception:
            return "Couldn't load offers", 500

    @auth_required
    @offers_namespace.expect(offer, validate=True)
    def post(self):
        """Add a new offer"""
        try:
            content = request.get_json()
            user_id = current_user().id

            for parameter in ['name', 'portions_number', 'pickup_localization', 'pickup_times', 'offer_expiry']:
                if parameter not in content:
                    return f"{parameter} missing in request", 400

            add_offer(user_id, content['name'], True, content['portions_number'], 0, content['pickup_localization'], datetime.now(),
                      content['pickup_times'], content['offer_expiry'], content.get('description', None), content.get('photo', None))
            return "Offer has been added", 201

        except Exception:
            return "Couldn't add offers", 500

offers_namespace.add_resource(Offers, "")