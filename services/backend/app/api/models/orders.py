from app import db
from sqlalchemy import desc


class Orders(db.Model):
    __tablename__ = "orders"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)  # Many orders from one user
    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'),
                         nullable=False)  # Many orders to one offer
    time = db.Column('timestamp', db.DateTime, nullable=False)
    portions = db.Column('portions_number', db.Integer, nullable=False)
    is_canceled = db.Column('is_canceled', db.Boolean, nullable=False)
    is_picked = db.Column('is_picked', db.Boolean, nullable=False)

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'fromUser_photo': self.offers_orders.user.profile_picture,
            'fromUser_name': self.offers_orders.user.name,
            'fromUser_surname': self.offers_orders.user.surname,
            'fromUser_id': self.offers_orders.user.id,
            'offer_id': self.offer_id,
            'offer_description': self.offers_orders.description,
            'offer_name': self.offers_orders.name,
            'portions': self.portions,
            'is_canceled': self.is_canceled,
            'is_picked': self.is_picked,
            'offer_photo': self.offers_orders.photo
        }
        return data

    @staticmethod
    def add_order(user_id, offer_id, time, portions):
        order = Orders(
            user_id=user_id,
            offer_id=offer_id,
            time=time,
            portions=portions,
            is_canceled=False,
            is_picked=False
        )
        db.session.add(order)
        db.session.commit()

    @staticmethod
    def update_order(content):
        order = Orders.query.filter_by(id=content['id']).first()
        order.offer_id = content['offer_id']
        order.portions=content['portions']
        order.is_canceled=content['is_canceled']
        order.is_picked=content['is_picked']

        db.session.commit()

    @staticmethod
    def get_all_orders():
        return Orders.query.all()

    @staticmethod
    def get_orders_of_user(user_id):
        return Orders.query.filter_by(user_id=user_id).order_by(Orders.is_canceled, Orders.is_picked)

    @staticmethod
    def get_order_by_id(order_id):
        return Orders.query.filter_by(id=order_id).first()

