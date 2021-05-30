from sqlalchemy.sql import func
from app import db, guard

class Message(db.Model):
    __tablename__ = "message"

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             nullable=False)  # Many messages from one user
    to_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                           nullable=False)  # Many masseges to one user
    offer = db.Column(db.Integer, db.ForeignKey('offer.id'),
                      nullable=False)  # Many ratings to one rater_user (user)
    message = db.Column('message', db.String(255), nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=func.now)

    def to_dict(self):
        data = {
            'id': self.id,
            'from': self.from_user_id,
            'to': self.to_user_id,
            'message': self.message,
        }
        return data
