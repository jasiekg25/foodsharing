from datetime import datetime, timedelta

from sqlalchemy.sql import func
from app import db

class UserNotification(db.Model):
    __tablename__ = "user_notification"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column('message', db.String(255), nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'timestamp': self.timestamp,
            'message': self.message
        }
        return data

    @staticmethod
    def get_notifications(user_id):
        return UserNotification.query\
            .filter_by(user_id=user_id)\
            .order_by(UserNotification.timestamp.desc())

    @staticmethod
    def add_user_notification(user_id, message):
        user_notification = UserNotification(
            user_id=user_id,
            message=message
        )
        db.session.add(user_notification)
        db.session.commit()


def emit_and_safe_notification(user_id, message):
    from flask_socketio import emit
    emit('notification', {'notification': {"message": message, "url": "/something"}}, room=f'user_{user_id}', #TODO url
         namespace="/notifs")
    UserNotification.add_user_notification(user_id, message)