from sqlalchemy.sql import func
from app import db, guard

class ChatMessage(db.Model):
    __tablename__ = "chat_message"

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             nullable=False)  # Many messages from one user
    chat_room_id = db.Column(db.Integer, db.ForeignKey('chat_room.id'),
                           nullable=False)  # Many masseges to one chat room
    message = db.Column('message', db.String(255), nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        data = {
            'id': self.id,
            'from_user_id': self.from_user_id,
            'chat_room_id': self.to_user_id,
            'message': self.message
        }
        return data