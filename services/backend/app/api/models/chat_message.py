from sqlalchemy.sql import func
from app import db, guard

class ChatMessage(db.Model):
    __tablename__ = "chat_message"

    id = db.Column(db.Integer, primary_key=True)
    from_user_id = db.Column(db.Integer, db.ForeignKey('user.id'),
                             nullable=False)  # Many messages from one user
    chat_room_id = db.Column(db.Integer, db.ForeignKey('room_chat.id'),
                           nullable=False)  # Many masseges to one chat room
    message = db.Column('message', db.String(255), nullable=False)
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=db.func.current_timestamp())

    def to_dict(self):
        data = {
            # 'id': self.id,
            'from_user_id': self.from_user_id,
            'from_user_name': self.messages_from_user.name,
            'from_user_surname': self.messages_from_user.surname,
            'message': self.message,
            'timestamp': self.timestamp
        }
        return data

    def to_dict_with_flag(self, current_user):
        data = {
            'id': self.id,
            'from_user_id': self.from_user_id,
            'chat_room_id': self.chat_room_id,
            'message': self.message,
        }
        return data

    @staticmethod
    def get_all_messages(chat_room_id):
        return ChatMessage.query\
            .filter_by(chat_room_id=chat_room_id)\
            .order_by(ChatMessage.timestamp.asc())

    @staticmethod
    def add_chat_message(from_user_id, chat_room_id, message):
        chat_message = ChatMessage(
            from_user_id=from_user_id,
            chat_room_id=chat_room_id,
            message=message
        )
        db.session.add(chat_message)
        db.session.commit()