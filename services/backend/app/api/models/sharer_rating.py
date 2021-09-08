
from sqlalchemy.sql import func
from app import db, guard


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
            'sharer_name': self.to_user_id.username,
            'date': self.date,
            'ratting': self.rating
        }
        return data

    @staticmethod
    def get_ratings(user_id):
        return SharerRating.query.filter_by(to_user_id=user_id)

    @staticmethod
    def add_rating(from_user_id, content):
        rating = SharerRating(
            to_user_id=content['to_user_id'],
            from_user_id=from_user_id,
            rating=content['rating'],
        )
        db.session.add(rating)
        db.session.commit()