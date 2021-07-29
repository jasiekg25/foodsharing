from sqlalchemy.sql import func
from app import db, guard

class ChatRoom(db.Model):
    __tablename__ = "chat_room"

    id = db.Column(db.Integer, primary_key=True)
    client = db.Column(db.Integer, db.ForeignKey('user.id'),
                           nullable=False)  # Many chatRooms to one client(user)

    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'),
                      nullable=False)  # Many ChatRooms to one offer
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=db.func.current_timestamp())



    messages =  db.relationship('ChatMessage', backref='chat_room_messages',
                                    foreign_keys='ChatMessage.chat_room_id')  # One chatroom has many ChatMasseges
    def to_dict(self):
        data = {
            'id': self.id,
            'offer_owner': self.offer.user_id,
            'client': self.client,
            'offer_id': self.offer_id
        }
        return data

    @staticmethod
    def add_chat_room(client, offer_id):
        chat_room = ChatRoom(
            client=client,
            offer_id=offer_id,

        )
        db.session.add(chat_room)
        db.session.commit()


    @staticmethod
    def get_all_rooms(user_id):
        return ChatRoom.query.filter_by(user_id=user_id)