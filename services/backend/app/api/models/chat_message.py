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
            'chat_room_id': self.chat_room_id,
            'message': self.message
        }
        return data

    @staticmethod
    def get_all_messages(chat_room_id):
        return ChatMessage.query.filter_by(chat_room_id=chat_room_id)

    @staticmethod
    def add_chat_message(user_id, chat_room_id, message):
        chat_message = ChatMessage(
            from_user_id=user_id,
            chat_room_id=chat_room_id,
            message=message
        )
        db.session.add(chat_message)
        db.session.commit()