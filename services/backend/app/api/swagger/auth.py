# services/users/app/api/auth.py


from flask import request, jsonify
from flask_restx import Namespace, Resource, fields
from flask_praetorian import current_user, auth_required

from app import guard, logger
from app.api.utils import get_user_by_email
from services.backend.app.api.models_old import User

auth_namespace = Namespace("auth")

user = auth_namespace.model(
    "User",
    {
        "email": fields.String(required=True),
        "firstName": fields.String(required=True),
        "lastName": fields.String(required=True)
    }
)

full_user = auth_namespace.clone(
    "Full User", user, {
        "password": fields.String(required=True)
    }
)

login = auth_namespace.model(
    "User",
    {"email": fields.String(required=True), "password": fields.String(required=True)},
)

refresh = auth_namespace.model(
    "Refresh", {"refresh_token": fields.String(required=True)}
)

tokens = auth_namespace.clone(
    "Access and refresh_tokens", refresh, {"access_token": fields.String(required=True)}
)

parser = auth_namespace.parser()
parser.add_argument("Authorization", location="headers")


class Register(Resource):
    @auth_namespace.expect(full_user, validate=True)
    @auth_namespace.response(201, "Success")
    @auth_namespace.response(400, "Sorry. That email already exists.")
    def post(self):
        post_data = request.get_json()
        name = post_data.get("firstName")
        surname = post_data.get("lastName")
        email = post_data.get("email")
        password = post_data.get("password")

        user = get_user_by_email(email)
        if user:
            auth_namespace.abort(400, "Sorry. That email already exists.")
        user = User.add_user(name, surname, email, password)
        return 200


class Login(Resource):
    @auth_namespace.response(200, "Success")
    @auth_namespace.response(404, "User does not exist")
    def post(self):
        post_data = request.get_json(force=True)
        email = post_data.get("email", None)
        password = post_data.get("password", None)

        if not get_user_by_email(email):
            auth_namespace.abort(404, "User does not exist")

        user = guard.authenticate(email, password)
        ret = {"access_token": guard.encode_jwt_token(user)}
        return ret


class Refresh(Resource):
    # @auth_namespace.expect(refresh, validate=True)
    @auth_namespace.response(200, "Success")
    @auth_namespace.response(401, "Invalid token")
    def get(self):
        old_token = guard.read_token_from_header()
        new_token = guard.refresh_jwt_token(old_token)
        ret = {'access_token': new_token}
        return ret, 200


class Status(Resource):
    @auth_namespace.marshal_with(user)
    @auth_required
    @auth_namespace.response(200, "Success")
    @auth_namespace.response(401, "Invalid token")
    @auth_namespace.expect(parser)
    def get(self):
        user = current_user()
        if not user:
            auth_namespace.abort(401, "Invalid token")
        return user, 200


auth_namespace.add_resource(Register, "/register")
auth_namespace.add_resource(Login, "/login")
auth_namespace.add_resource(Refresh, "/refresh")
auth_namespace.add_resource(Status, "/status")
