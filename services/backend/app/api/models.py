# app/api/models.py

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
    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'),
                         nullable=False)  # Many orders to one offer
    time = db.Column('message', db.DateTime, nullable=False)
    portions = db.Column('portions_number', db.Integer, nullable=False)
    accepted = db.Column('accepted', db.Boolean, nullable=False)

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'offer_id': self.offer_id,
            'portions': self.portions,
            "accepted": self.accepted
        }
        return data


offers_tags = db.Table("offers_tags",
                       db.Column('offer_id', db.Integer, db.ForeignKey('offer.id'), nullable=False),
                       db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), nullable=False))


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
                             foreign_keys='Order.offer_id')  # One offer to many Orders

    tags = db.relationship('Tag', secondary=offers_tags, back_populates='offers')


    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'name': self.name,
            'active': self.active,
            "description": self.description,
            "photo": self.photo,
            "portions_number": self.portions_number,
            "used_portions": self.used_portions,
            "pickup_localization": self.pickup_localization,
            "post_time": self.post_time,
            "pickup_times": self.pickup_times,
            "offer_expiry": self.offer_expiry
        }
        return data

# class OfferTag(db.Model):
#     __tablename__ = "offer_tag"
#
#     id = db.Column(db.Integer, primary_key=True)
#     offer_id =   # Many offerTags to one offer
#     tag_id = db.Column('tag_id', db.Integer, db.ForeignKey('tag.id'), nullable=False)  # Many offerTags to one offer


class Tag(db.Model):
    __tablename__ = "tag"

    id = db.Column(db.Integer, primary_key=True)
    tag_name = db.Column('tag_name', db.String(255), nullable=False)
    wanted = db.Column('wanted', db.Boolean, nullable=False)

    offers = db.relationship('Offer', back_populates='tags', secondary=offers_tags)  # one tag to many OfferTags


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
