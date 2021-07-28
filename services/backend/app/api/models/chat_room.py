from sqlalchemy.sql import func
from app import db, guard

class ChatRoom(db.Model):
    __tablename__ = "chat_room"

    id = db.Column(db.Integer, primary_key=True)
    client = db.Column(db.Integer, db.ForeignKey('user.id'),
                           nullable=False)  # Many chatRooms to one client(user)

    offer = db.Column(db.Integer, db.ForeignKey('offer.id'),
                      nullable=False)  # Many ChatRooms to one offer
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=func.now)

    messages =  db.relationship('ChatMessage', backref='chat_room_messages',
                                    foreign_keys='ChatMessage.chat_room_id')  # One chatroom has many ChatMasseges
    def to_dict(self):
        data = {
            'id': self.id,
            'offer_owner': self.offer.user_id,
            'client': self.client,
            'offer': self.offer
        }
        return data