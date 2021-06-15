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
        "pickup_longitude": fields.Float(readOnly=True),
        "pickup_latitude": fields.Float(readOnly=True),
        "post_time": fields.DateTime(readOnly=True),
        "pickup_times": fields.String(readOnly=True),
        "offer_expiry": fields.DateTime(readOnly=True),
        "tags": fields.List(fields.String(readOnly=True))
    },
)

parser = reqparse.RequestParser()
parser.add_argument('lon', type=float)
parser.add_argument('lat', type=float)
parser.add_argument('page', type=int)
parser.add_argument('tags_ids', action='split')


class OffersSearch(Resource):
    @auth_required
    @offers_search_namespace.marshal_with(offer_search)
    def get(self):
        """Returns all offers (except created by me ones) with user info"""
        logger.info("Offers.get()")
        try:
            content = parser.parse_args()
            user_id = current_user().id

            # get all offers except mine
            offers = Offer.get_all_active_offers_except_mine(user_id=user_id)

            # deal with tags
            tagged_offers = Offer.check_tags(offers, content.get('tags_ids', []))
            # sort with localization
            sorted_offers = Offer.sort_by_distance_from_user(tagged_offers, content['lon'], content['lat'])

            # pagination
            paginated_offers = sorted_offers.paginate(page=content['page'], per_page=15)

            return [offer.to_search_dict()  for offer in paginated_offers.items], 200
        except Exception as e:
            logger.exception("Offers.get(): %s", str(e))
            return "Couldn't load offers", 500


offers_search_namespace.add_resource(OffersSearch, "")
