# app/api/models_old.py

from sqlalchemy.sql import func
from app import db, guard


class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    surname = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    password_salt = db.Column(db.String(255), nullable=False)
    profile_description = db.Column(db.String(255), nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(255), nullable=False)
    localization = db.Column(db.String(255), nullable=True)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    client_rattings_from = db.relationship('ClientRating', backref='client_ratting_from_you',
                                           foreign_keys='ClientRating.from_user_id')  # One user to many ClientRatings
    client_rattings_to = db.relationship('ClientRating', backref='client_ratting_to_you',
                                         foreign_keys='ClientRating.to_user_id')  # One user to many ClientRatings

    sharer_rattings_from = db.relationship('SharerRating', backref='sharer_ratting_form_you',
                                           foreign_keys='SharerRating.from_user_id')  # One user to many SharerRatings
    sharer_rattings_to = db.relationship('SharerRating', backref='sharer_ratting_to_you',
                                         foreign_keys='SharerRating.to_user_id')  # One user to many SharerRatings

    messages_from = db.relationship('Message', backref='messages_from',
                                    foreign_keys='Message.from_user_id')  # One user as author of many Messages
    messages_to = db.relationship('Message', backref='messages_to',
                                  foreign_keys='Message.to_user_id')  # One user as recipient of many Messages

    orders = db.relationship('Order', backref='order_from',
                             foreign_keys='Order.user_id')  # One user many Orders

    offers = db.relationship('Offer', backref='user',
                             foreign_keys='Offer.user_id')  # One user many Orders

    def __init__(self, username="", name="", surname="", email="", password="", profile_description="",
                 password_salt="", profile_picture="", phone="", localization=""):
        self.username = username
        self.name = name
        self.surname = surname
        self.email = email
        self.profile_description = profile_description
        self.password_salt = password_salt
        self.profile_picture = profile_picture
        self.phone = phone
        self.localization = localization
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

    @staticmethod
    def add_user(name, surname, email, password):
        user = User(name=name, surname=surname, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        return user


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



