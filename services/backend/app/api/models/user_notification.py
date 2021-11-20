from datetime import datetime, timedelta

from sqlalchemy.sql import func
from app import db



class UserNotification(db.Model):
    __tablename__ = "user_notification"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    message = db.Column('message', db.String(255), nullable=False)
    chat_url = db.Column('chat_url', db.String(255), nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        data = {
            'user_id': self.user_id,
            'timestamp': self.timestamp,
            'message': self.message,
            'chat_url': self.chat_url
        }
        return data

    @staticmethod
    def get_notifications(user_id):
        return UserNotification.query\
            .filter_by(user_id=user_id)\
            .order_by(UserNotification.timestamp.desc())

    @staticmethod
    def add_user_notification(user_id, message, url):
        user_notification = UserNotification(
            user_id=user_id,
            message=message,
            chat_url=url
        )
        db.session.add(user_notification)
        db.session.commit()


def emit_and_safe_notification(user_id, message, offer_id):
    from flask_socketio import emit
    from app.api.models.chat_room import ChatRoom
    if ChatRoom.exists(user_id, offer_id):
        chat = ChatRoom.get_chat_room(user_id, offer_id)
    else:
        ChatRoom.add_chat_room(user_id, offer_id)
        chat = ChatRoom.get_chat_room(user_id, offer_id)
    url = f"/chat/{chat.id}/offers/{offer_id}"
    emit('notification', {'notification': {"message": message, "url": url}}, room=f'user_{user_id}',
         namespace="/notifs")
    UserNotification.add_user_notification(user_id, message, url)


def emit_and_safe_notification_offer_author(author_id, message, offer_id, customer_id):
    from flask_socketio import emit
    from app.api.models.chat_room import ChatRoom
    if ChatRoom.exists(customer_id, offer_id):
        chat = ChatRoom.get_chat_room(customer_id, offer_id)
    else:
        ChatRoom.add_chat_room(customer_id, offer_id)
        chat = ChatRoom.get_chat_room(customer_id, offer_id)
    url = f"/chat/{chat.id}/offers/{offer_id}"
    emit('notification', {'notification': {"message": message, "url": url}}, room=f'user_{author_id}',
         namespace="/notifs")
    UserNotification.add_user_notification(author_id, message, url)