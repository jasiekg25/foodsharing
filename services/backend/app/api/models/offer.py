from datetime import datetime

from sqlalchemy.sql import func
from app import db
from .tag import OffersTags


class Offer(db.Model):
    __tablename__ = "offer"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))  # Many orders from one user
    name = db.Column('name', db.String(255),
                     nullable=False)
    active = db.Column('active', db.Boolean, nullable=False)
    description = db.Column('description', db.Text, nullable=True)
    photo = db.Column('photo', db.String(255), nullable=True)
    portions_number = db.Column('portions_number', db.Integer, nullable=False)
    used_portions = db.Column('used_portions', db.Integer, nullable=False)
    pickup_longitude = db.Column('pickup_longitude', db.Float, nullable=False)
    pickup_latitude = db.Column('pickup_latitude', db.Float, nullable=False)
    post_time = db.Column('post_time', db.DateTime, nullable=False, default=func.now)
    pickup_times = db.Column('pickup_times', db.String(255), nullable=False)
    offer_expiry = db.Column('offer_expiry', db.DateTime, nullable=False)

    messages = db.relationship('Message', backref='offers_messages',
                               foreign_keys='Message.offer')  # One offer to many Messages

    orders = db.relationship('Orders', backref='offers_orders',
                             foreign_keys='Orders.offer_id')  # One offer to many Orders

    tags = db.relationship('OffersTags', back_populates='offer')


    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user.id,
            'user_username': self.user.username,
            'user_name': self.user.name,
            'user_surname': self.user.surname,
            'name': self.name,
            'active': self.active,
            "description": self.description,
            "photo": self.photo,
            "portions_number": self.portions_number,
            "used_portions": self.used_portions,
            "pickup_latitude": self.pickup_latitude,
            "pickup_longitude": self.pickup_longitude,
            "post_time": self.post_time,
            "pickup_times": self.pickup_times,
            "offer_expiry": self.offer_expiry,
            "tags": [offer_tag.tag.to_dict() for offer_tag in self.tags]
        }

        return data

    def to_search_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user.id,
            'user_username': self.user.username,
            'user_name': self.user.name,
            'user_surname': self.user.surname,
            'name': self.name,
            'active': self.active,
            "description": self.description,
            "photo": self.photo,
            "portions_number": self.portions_number,
            "used_portions": self.used_portions,
            "pickup_latitude": self.pickup_latitude,
            "pickup_longitude": self.pickup_longitude,
            "post_time": self.post_time,
            "pickup_times": self.pickup_times,
            "offer_expiry": self.offer_expiry,
            "tags": [offer_tag.tag.tag_name for offer_tag in self.tags]
        }

        return data

    @staticmethod
    def add_offer(user_id, name, active, portions_number, used_portions, pickup_long, pickup_lat, post_time,
                  pickup_times,
                  offer_expiry, description=None, photo=None):
        offer = Offer(
            user_id=user_id,
            name=name,
            active=active,
            portions_number=portions_number,
            used_portions=used_portions,
            pickup_longitude=pickup_long,
            pickup_latitude=pickup_lat,
            post_time=post_time,
            pickup_times=pickup_times,
            offer_expiry=offer_expiry,
            description=description,
            photo=photo
        )
        db.session.add(offer)
        db.session.commit()
        return offer.id

    @staticmethod
    def update_offer(content, photo_url):
        offer = Offer.query.filter_by(id=content['id']).first()
        offer.name = content['name']
        offer.active = content['active']
        offer.portions_number = content['portions_number']
        offer.pickup_longitude = content['pickup_longitude']
        offer.pickup_latitude = content['pickup_latitude']
        offer.pickup_times = content['pickup_times']
        offer.offer_expiry = content['offer_expiry']
        offer.description = content['description']
        offer.photo = photo_url

        OffersTags.query.filter_by(offer_id = content['id']).delete()

        for tag in content.get('tags', []):
            OffersTags.add_offer_tag(content['id'], tag['tag_id'])
        db.session.commit()


    @staticmethod
    def get_all_offers():
        return Offer.query.all()

    @staticmethod
    def get_active_offers():
        return Offer.query.filter_by(active=True)\
                .filter(Offer.used_portions < Offer.portions_number)\
                .filter(Offer.offer_expiry >= datetime.now())


    @staticmethod
    def update_used_portions(offer_id, new_order_portions):
        Offer.query.filter_by(id=offer_id).first().used_portions = new_order_portions
        db.session.commit()

    @staticmethod
    def get_offer_by_id(offer_id):
        return Offer.query.filter_by(id=offer_id).first()

    @staticmethod
    def get_current_offers_of_user(user_id):
       return Offer.query.filter_by(user_id=user_id) \
        .filter(Offer.active==True) \
        .filter(Offer.used_portions < Offer.portions_number) \
        .filter(Offer.offer_expiry >= datetime.now())

    @staticmethod
    def get_all_active_offers_except_mine(user_id):
        return Offer.query.filter_by(active=True)\
            .filter(Offer.user_id != user_id)\
            .filter(Offer.used_portions < Offer.portions_number)\
            .filter(Offer.offer_expiry >= datetime.now())




