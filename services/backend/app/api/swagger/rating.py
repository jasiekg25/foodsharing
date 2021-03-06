import json
from datetime import datetime

from flask import request
from flask_restx import Resource, fields, Namespace
from flask_praetorian import current_user, auth_required
from app import logger
from app.api.models.sharer_rating import SharerRating

rating_namespace = Namespace("rating_namespace")

# doing this add description to Swagger Doc
rating_model = rating_namespace.model(
    "Sharer_rating",
    {
        'id': fields.Integer(readOnly=True),
        'from': fields.String(readOnly=True),
        'sharer_name': fields.String(readOnly=True),
        'date': fields.DateTime(readOnly=True),
        'ratting': fields.Float(readOnly=True)
    }
)


class Rating(Resource):
    @auth_required
    @rating_namespace.marshal_with(rating_model)
    def get(self):
        """Returns sharer rating info"""
        try:
            user_id = current_user().id
            logger.info("Rating.get() user_id: %s", str(user_id))
            ratings = SharerRating.get_ratings(user_id)
            return [rating.to_dict() for rating in ratings], 200
        except Exception as e:
            logger.exception("Rating.get(): %s", str(e))
            return "Couldn't load user rating", 500

    @auth_required
    @rating_namespace.expect(rating_model)
    def post(self):
        logger.info("Rating.post() request_body: %s", str(request.get_json()))
        try:
            user_id = current_user().id
            content = request.get_json()
            SharerRating.add_rating(user_id, content)
            return "Rating added", 201
        except Exception as e:
            logger.exception("Rating.post(): %s", str(e))
            return "Couldn't load user ratings", 500

rating_namespace.add_resource(Rating, "")