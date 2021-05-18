from datetime import datetime

from flask import request, Response
from flask_restx import Resource, fields, Namespace, reqparse, inputs
from flask_praetorian import current_user, auth_required

from app import logger
from app.api.models.offer import Offer
from app.api.models.tag import OffersTags, Tag

offers_search_namespace = Namespace("search_offers")

# doing this add description to Swagger Doc
offer_search = offers_search_namespace.model(
    "Offer",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.String(readOnly=True),
        "user_name": fields.String(readOnly=True),
        "user_surname": fields.String(readOnly=True),
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
        "tags": fields.String(readOnly=True)
    },
)

parser = reqparse.RequestParser()
parser.add_argument("tags_ids", type=int, required=False, action='split')


class OffersSearch(Resource):
    @auth_required
    @offers_search_namespace.expect(parser)
    @offers_search_namespace.marshal_with(offer_search)
    def get(self):
        """Returns all offers with user info"""
        global offers
        logger.info("Offers.get()")
        try:
            args = parser.parse_args()

            user_id = current_user().id
            offers = Offer.get_all_active_offers_except_mine(user_id=user_id)

            # deal with tags
            if args['tags_ids'] is None:
                return [offer.to_search_dict()  for offer in offers], 200

            elif args['tags_ids'] is not None:
                tags_ids = args['tags_ids']
                offers = filter(lambda offer: any(tag for tag in offer.tags if tag.tag_id in tags_ids), offers)
                return [offer.to_search_dict()  for offer in offers], 200

            # return [offer.to_dict() for offer in offers], 200
        except Exception as e:
            logger.exception("Offers.get(): %s", str(e))
            return "Couldn't load offers", 500


offers_search_namespace.add_resource(OffersSearch, "")
