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
    profile_description = db.Column(db.Text, nullable=True)
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

    orders = db.relationship('Orders', backref='order_from',
                             foreign_keys='Orders.user_id')  # One user many Orders

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

    @staticmethod
    def get_user_profile_info(user_id):
        return User.query.filter_by(id=user_id).first()

    @staticmethod
    def update_user_profile_info(user_id, content):
        user = User.query.filter_by(id=user_id).first()
        user.username = content['username']
        user.name = content['name']
        user.surname = content['surname']
        user.email = content['email']
        user.profile_description = content['profile_description']
        user.profile_picture = content['profile_picture']
        user.phone = content['phone']
        user.localization = content['localization']
        user.active = content['active']
        user.created_date = content['created_date']
        db.session.commit()

