# app/api/models.py

import os
import datetime
import jwt

from flask import current_app
from sqlalchemy.sql import func
from app import db, bcrypt


class User(db.Model):

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    def __init__(self, username="", email="", password=""):
        self.username = username
        self.email = email
        self.password = bcrypt.generate_password_hash(
            password, current_app.config.get("BCRYPT_LOG_ROUNDS")
        ).decode()

    def encode_token(self, user_id, token_type):
        if token_type == "access":
            seconds = current_app.config.get("ACCESS_TOKEN_EXPIRATION")
        else:
            seconds = current_app.config.get("REFRESH_TOKEN_EXPIRATION")

        payload = {
            "exp": datetime.datetime.utcnow() + datetime.timedelta(seconds=seconds),
            "iat": datetime.datetime.utcnow(),
            "sub": user_id,
        }
        return jwt.encode(
            payload, current_app.config.get("SECRET_KEY"), algorithm="HS256"
        )

    @staticmethod
    def decode_token(token):
        payload = jwt.decode(token, current_app.config.get("SECRET_KEY"))
        return payload["sub"]


class ClientRating(db.Model):
    __tablename__ = "client_rating"

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             nullable=False)  # Many ratings from one user
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                           nullable=False)  # Many ratings to one user
    date = db.Column('date', db.DateTime, nullable=False, default=func.now)
    rating = db.Column('rating', db.Float, nullable=False)

    def to_dict(self):
        data = {
            'id': self.id,
            'from': self.from_user_id.username,
            'author_name': self.to_user_id.username,
            'date': self.date,
            'ratting': self.rating
        }
        return data


class SharerRating(db.Model):
    __tablename__ = "sharer_rating"

    id = db.Column(db.Integer, primary_key=True)
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                           nullable=False)  # Many ratings to one user
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             nullable=False)  # Many ratings from one user
    date = db.Column('date', db.DateTime, nullable=False, default=func.now)
    rating = db.Column('rating', db.Float, nullable=False)

    def to_dict(self):
        data = {
            'id': self.id,
            'from': self.from_user_id.username,
            'author_name': self.to_user_id.username,
            'date': self.date,
            'ratting': self.rating
        }
        return data


class Message(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             nullable=False)  # Many messages from one user
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                           nullable=False)  # Many masseges to one user
    offer = db.Column(db.Integer, db.ForeignKey('offer.id'),
                      nullable=False)  # Many ratings to one rater_user (user)
    message = db.Column('message', db.String(255), nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=func.now)

    def to_dict(self):
        data = {
            'id': self.id,
            'from': self.from_user_id,
            'to': self.to_user_id,
            'message': self.message,
        }
        return data


class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)  # Many orders from one user
    offer = db.Column(db.Integer, db.ForeignKey('offer.id'),
                      nullable=False)  # Many orders to one offer
    time = db.Column('message', db.DateTime, nullable=False)
    portions = db.Column('portions_number', db.Integer, nullable=False)
    accepted = db.Column('accepted', db.Boolean, nullable=False)

class Offer(db.Model):
    __tablename__ = "offer"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)  # Many orders from one user
    name = db.Column('name', db.String(255),
                      nullable=False)
    active = db.Column('active', db.Boolean, nullable=False)
    description = db.Column('description', db.Text, nullable=True)
    photo = db.Column('photo', db.String(255), nullable=True)
    portions_number = db.Column('portions_number', db.Integer, nullable=False)
    used_portions = db.Column('used_portions', db.Integer, nullable=False)
    pickup_localization = db.Column('pickup_localization', db.String(255), nullable=False)
    post_time = db.Column('post_time', db.DateTime, nullable=False, default=func.now)
    pickup_times = db.Column('pickup_times', db.String(255), nullable=False)
    offer_expiry = db.Column('offer_expiry', db.DateTime, nullable=False)

    messages = db.relationship('Message', backref='offers_messages',
                             foreign_keys='Message.offer')  # One offer to many Messages

    orders = db.relationship('Order', backref='offers_orders',
                               foreign_keys='Order.offer')  # One offer to many Orders

    offer_tags = db.relationship('OfferTag', backref='offer_tag_offer', foreign_keys='OfferTag.id') # one offer to many OfferTags


class OfferTag(db.Model):
    __tablename__ = "offer_tag"

    id = db.Column(db.Integer, primary_key=True)
    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'))  # Many offerTags to one offer
    tag_id = db.Column(db.Integer, db.ForeignKey('tag.id'))  # Many offerTags to one offer

class OfferTag(db.Model):
    __tablename__ = "tag"

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column('tag_name', db.String(255), nullable=False)
    wanted = db.Column('wanted', db.Boolean, nullable=False)

    offer_tags = db.relationship('OfferTag', backref='offer_tag_tag', foreign_keys='OfferTag.id') # one tag to many OfferTags




class Quote(db.Model):
    __tablename__ = "quote"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column('content', db.Text())
    author_id = db.Column(db.Integer, db.ForeignKey('author.id'))  # Many quotes to one author

    def to_dict(self):
        data = {
            'id': self.id,
            'content': self.content,
            'author_name': self.author.name,
        }
        return data

class Author(db.Model):
    __tablename__ = "author"

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column('name', db.String(50), unique=True)
    birthday = db.Column('birthday', db.DateTime)
    bornlocation = db.Column('bornlocation', db.String(150))
    bio = db.Column('bio', db.Text())
    quotes = db.relationship('Quote', backref='author')  # One author to many Quotes
