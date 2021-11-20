from flask import request
from flask_restx import Resource, fields, Namespace

from app import logger
from app.api.models.tag import Tag

tags_namespace = Namespace("tags")

# doing this add description to Swagger Doc
tag = tags_namespace.model(
    "Tag",
    {
        "id": fields.Integer(readOnly=True),
        "tag_name": fields.String(readOnly=True)
    },
)


class Tags(Resource):

    @tags_namespace.marshal_with(tag)
    def get(self):
        """Returns all tags info"""
        logger.info("Tags.get()")
        try:
            tags = Tag.get_all_tags()

            return tags, 200
        except Exception as e:
            logger.exception("Tags.get(): %s", str(e))
            return "Couldn't load tags", 500


tags_namespace.add_resource(Tags, "")