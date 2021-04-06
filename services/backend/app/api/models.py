# app/api/models.py

import os
import datetime
import jwt

from flask import current_app
from sqlalchemy.sql import func
from app import db, guard


class User(db.Model):

    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    def __init__(self, username="", email="", password=""):
        self.username = username
        self.email = email
        self.hashed_password = guard.hash_password(password)

    def encode_token(self, user_id, token_type):
        pass

    @staticmethod
    def decode_token(token):
        pass

    @property
    def identity(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has an ``identity`` instance
        attribute or property that provides the unique id of the user instance
        """
        return self.id

    @property
    def rolenames(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``rolenames`` instance
        attribute or property that provides a list of strings that describe the roles
        attached to the user instance
        """
        try:
            return self.roles.split(",")
        except Exception:
            return []

    @property
    def password(self):
        """
        *Required Attribute or Property*

        flask-praetorian requires that the user class has a ``password`` instance
        attribute or property that provides the hashed password assigned to the user
        instance
        """
        return self.hashed_password

    @classmethod
    def lookup(cls, email):
        """
        *Required Method*

        flask-praetorian requires that the user class implements a ``lookup()``
        class method that takes a single ``username`` argument and returns a user
        instance if there is one that matches or ``None`` if there is not.
        """
        return cls.query.filter_by(email=email).one_or_none()

    @classmethod
    def identify(cls, id):
        """
        *Required Method*

        flask-praetorian requires that the user class implements an ``identify()``
        class method that takes a single ``id`` argument and returns user instance if
        there is one that matches or ``None`` if there is not.
        """
        return cls.query.get(id)


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
