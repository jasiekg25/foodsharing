from sqlalchemy.sql import func
from app import db, guard
from .sharer_rating import SharerRating

class User(db.Model):
    __tablename__ = "user"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(128), nullable=False)
    name = db.Column(db.String(128), nullable=False)
    surname = db.Column(db.String(128), nullable=False)
    email = db.Column(db.String(128), nullable=False)
    hashed_password = db.Column(db.String(255), nullable=False)
    profile_description = db.Column(db.Text, nullable=True)
    profile_picture = db.Column(db.String(255), nullable=True)
    phone = db.Column(db.String(255), nullable=False)
    active = db.Column(db.Boolean(), default=True, nullable=False)
    created_date = db.Column(db.DateTime, default=func.now(), nullable=False)

    sharer_rattings_from = db.relationship('SharerRating', backref='sharer_ratting_form_you',
                                           foreign_keys='SharerRating.from_user_id')  # One user to many SharerRatings
    sharer_rattings_to = db.relationship('SharerRating', backref='sharer_ratting_to_you',
                                         foreign_keys='SharerRating.to_user_id')  # One user to many SharerRatings

    orders = db.relationship('Orders', backref='order_from',
                             foreign_keys='Orders.user_id')  # One user many Orders

    offers = db.relationship('Offer', backref='user',
                             foreign_keys='Offer.user_id')  # One user many Orders

    chat_rooms_client = db.relationship('ChatRoom', backref='chat_rooms_client',
                                    foreign_keys='ChatRoom.client')  # One user as client of many ChatRooms

    messages_from = db.relationship('ChatMessage', backref='messages_from_user',
                                    foreign_keys='ChatMessage.from_user_id')  # One user as author of many Messages

    notifications = db.relationship('UserNotification', backref='notifications',
                                    foreign_keys='UserNotification.user_id')  # One user many Notifications

    def __init__(self, username="", name="", surname="", email="", password="", profile_description="",
                profile_picture=None, phone=""):
        self.username = username
        self.name = name
        self.surname = surname
        self.email = email
        self.profile_description = profile_description
        self.profile_picture = profile_picture
        self.phone = phone
        self.hashed_password = guard.hash_password(password)

    def encode_token(self, user_id, token_type):
        pass

    def to_dict(self):
        data = {
            "id": self.id,
            "username": self.username,
            "name": self.name,
            "surname": self.surname,
            "email": self.email,
            "profile_description": self.profile_description,
            "profile_picture": self.profile_picture,
            "phone": self.phone,
            "rating": SharerRating.get_user_rating_aggregated(self.id),
            "active": self.active,
            "created_date": self.created_date
            }
        return data

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

    @staticmethod
    def get_user_profile_info(user_id):
        return User.query.filter_by(id=user_id).first()

    @staticmethod
    def update_user_profile_info(user_id, content, photo_url):
        user = User.query.filter_by(id=user_id).first()
        user.email = content['email']
        user.profile_description = content['profile_description']
        user.profile_picture = photo_url
        user.phone = content['phone']
        db.session.commit()
