from app import db
from app.api.models import Order


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