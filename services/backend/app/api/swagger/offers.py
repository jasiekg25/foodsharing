from datetime import datetime

from flask import request, Response
from flask_restx import Resource, fields, Namespace, reqparse, inputs
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.offer import Offer
from app.api.models.tag import OffersTags, Tag

offers_namespace = Namespace("offers")

# doing this add description to Swagger Doc
offer = offers_namespace.model(
    "Offer",
    {
        "id": fields.Integer(readOnly=True),
        "user_name": fields.String(readOnly=True),
        "name": fields.String(readOnly=True),
        "active": fields.Boolean(readOnly=True),
        "description": fields.String(readOnly=True),
        "photo": fields.String(readOnly=True),
        "portions_number": fields.Integer(readOnly=True),
        "used_portions": fields.Integer(readOnly=True),
        "pickup_localization": fields.String(readOnly=True),
        "post_time": fields.DateTime(readOnly=True),
        "pickup_times": fields.String(readOnly=True),
        "offer_expiry": fields.DateTime(readOnly=True),
        "tags": fields.List(fields.String(readOnly=True))
    },
)

parser = reqparse.RequestParser()
parser.add_argument("tags_ids", type=int, required=False, action='split')


class Offers(Resource):
    @auth_required
    @offers_namespace.expect(parser)
    @offers_namespace.marshal_with(offer)
    def get(self):
        """Returns all offers with user info"""
        logger.info("Offers.get()")
        try:
            args = parser.parse_args()
            offers = Offer.query.all()

            # deal with tags
            if args['tags_ids'] is None:
                return [offer.to_dict() for offer in offers], 200


            elif args['tags_ids'] is not None:
                tags_ids = args['tags_ids']
                offers = filter(lambda offer: any(tag for tag in offer.tags if tag.tag_id in tags_ids), offers)
                return [offer.to_dict() for offer in offers], 200

            # return [offer.to_dict() for offer in offers], 200
        except Exception as e:
            logger.exception("Offers.get(): %s", str(e))
            return "Couldn't load offers", 500

    @auth_required
    @offers_namespace.expect(offer)
    def post(self):
        """Add a new offer"""
        logger.info("Offers.post() request_body: %s", str(request.get_json()))
        try:
            content = request.get_json()
            user_id = current_user().id

            for parameter in ['name', 'portions_number', 'pickup_localization', 'pickup_times', 'offer_expiry']:
                if parameter not in content:
                    return f"{parameter} missing in request", 400

            offer_id = Offer.add_offer(user_id, content['name'], True, content['portions_number'], 0,
                                       content['pickup_localization'], datetime.now(),
                                       content['pickup_times'], content['offer_expiry'],
                                       content.get('description', None), content.get('photo', None))

            for tag_id in content.get('tags', []):
                OffersTags.add_offer_tag(offer_id, tag_id)
            return "Offer has been added", 201

        except Exception as e:
            logger.exception("Offers.post(): %s", str(e))
            return "Couldn't add offers", 500


offers_namespace.add_resource(Offers, "")
