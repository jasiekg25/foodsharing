from app import db
from app.api.models import Offer


def add_offer(user_id, name, active, portions_number, used_portions, pickup_localization, post_time, pickup_times,
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


def get_all_offers():
    return Offer.query.all()


def get_offer_by_id(offer_id):
    return Offer.query.filter_by(id=offer_id).first()


def update_used_portions(offer_id, new_order_portions):
    Offer.query.filter_by(id=offer_id).first().used_portions = new_order_portions
    db.session.commit()
