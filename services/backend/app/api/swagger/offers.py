import json
from datetime import datetime

from flask import request, Response
from flask_restx import Resource, fields, Namespace, reqparse, inputs
from flask_praetorian import current_user, auth_required
from app import logger, cloudinary_uploader
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
        "pickup_longitude": fields.Float(readOnly=True),
        "pickup_latitude": fields.Float(readOnly=True),
        "post_time": fields.DateTime(readOnly=True),
        "pickup_times": fields.String(readOnly=True),
        "offer_expiry": fields.DateTime(readOnly=True),
        "tags": fields.List(fields.String(readOnly=True))
    },
)

offer_search = offers_namespace.model(
    "Offer",
    {
        "id": fields.Integer(readOnly=True),
        "user_id": fields.String(readOnly=True),
        "user_name": fields.String(readOnly=True),
        "user_surname": fields.String(readOnly=True),
        "user_photo": fields.String(readOnly=True),
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
parser.add_argument('sorted_by', required=True)
# parser.add_argument('descending', type=bool, required=True)

class Offers(Resource):
    @auth_required
    @offers_namespace.marshal_with(offer_search)
    def get(self):
        """Returns all offers (except created by me ones) with user info"""
        logger.info("Offers.get()")
        try:
            content = parser.parse_args()
            user_id = current_user().id
             # get all offers
            offers = Offer.get_all_active_offers_except_mine(user_id=user_id)

            # get offers which contains all selected tags
            tags = content['tags_ids']
            tags = list(map(int, tags)) if tags[0] != '' else []
            tagged_offers = Offer.check_tags(offers, tags)

            # sort by chosen parameter (by localization - ascending; by rating - descending)
            sorted_offers = []
            if content['sorted_by'] == "localization":
                sorted_offers = Offer.sort_by_distance_from_user(tagged_offers, content['lon'], content['lat'])
            if content['sorted_by'] == "rating":
                sorted_offers = Offer.sort_by_owner_ranking(tagged_offers)

            paginated_offers = sorted_offers.paginate(page=content['page'], per_page=15)

            return [offer.to_search_dict() for offer in paginated_offers.items], 200
        except Exception as e:
            logger.exception("Offers.get(): %s", str(e))
            return "Couldn't load offers", 500

    @auth_required
    @offers_namespace.expect(offer)
    def post(self):
        """Add a new offer"""
        logger.info("Offers.post() request_body: %s", str(request.get_json()))
        try:
            content = json.loads(request.form['data'])
            user_id = current_user().id
            photo = request.files.get('photo', None)
            photo_url = cloudinary_uploader.upload(photo)['url'] if photo else None

            for parameter in ['name', 'portions_number', 'longitude', 'latitude', 'pickup_times', 'offer_expiry']:
                if parameter not in content:
                    return f"{parameter} missing in request", 400

            offer_id = Offer.add_offer(user_id, content['name'], True, content['portions_number'],
                                       content['longitude'], content['latitude'], datetime.now(),
                                       content['pickup_times'], content['offer_expiry'],
                                       content.get('description', None), photo_url)

            for tag_id in content.get('tags', []):
                OffersTags.add_offer_tag(offer_id, tag_id)
            return "Offer has been added", 201

        except Exception as e:
            logger.exception("Offers.post(): %s", str(e))
            return "Couldn't add offers", 500


offers_namespace.add_resource(Offers, "")
