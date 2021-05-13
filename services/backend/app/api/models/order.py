from app import db


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


def get_all_orders():
    return Order.query.all()

def get_orders_of_user(user_id):
    return Order.query.filter_by(user_id=user_id)
