from app import db
from sqlalchemy import desc


class Order(db.Model):
    __tablename__ = "order"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                        nullable=False)  # Many orders from one user
    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'),
                         nullable=False)  # Many orders to one offer
    time = db.Column('timestamp', db.DateTime, nullable=False)
    portions = db.Column('portions_number', db.Integer, nullable=False)
    accepted = db.Column('accepted', db.Boolean, nullable=False)

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'fromUser_name': self.offers_orders.user.name,
            'fromUser_surname': self.offers_orders.user.surname,
            'fromUser_id': self.offers_orders.user.id,
            'offer_id': self.offer_id,
            'offer_description': self.offers_orders.description,
            'offer_name': self.offers_orders.name,
            'portions': self.portions,
            'accepted': self.accepted,
            'offer_photo': self.offers_orders.photo
        }
        return data

    @staticmethod
    def add_order(user_id, offer_id, time, portions):
        order = Order(
            user_id=user_id,
            offer_id=offer_id,
            time=time,
            portions=portions,
            accepted=False
        )
        db.session.add(order)
        db.session.commit()

    @staticmethod
    def get_all_orders():
        return Order.query.all()

    @staticmethod
    def get_orders_of_user(user_id):
        return Order.query.filter_by(user_id=user_id).order_by(desc(Order.accepted))

