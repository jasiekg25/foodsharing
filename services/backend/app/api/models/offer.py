from datetime import datetime

from sqlalchemy.sql import func
from app import db
from app.api.models.tag import offers_tags


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
            'user_name': self.user.username,
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

    @staticmethod
    def add_offer(user_id, name, active, portions_number, used_portions, pickup_localization, post_time,
                  pickup_times,
                  offer_expiry, description=None, photo=None):
        offer = Offer(
            user_id=user_id,
            name=name,
            active=active,
            portions_number=portions_number,
            used_portions=used_portions,
            pickup_localization=pickup_localization,
            post_time=post_time,
            pickup_times=pickup_times,
            offer_expiry=offer_expiry,
            description=description,
            photo=photo
        )
        db.session.add(offer)
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


