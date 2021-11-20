from sqlalchemy.sql import func, desc, and_, nullslast
from app import db, guard

from .offer import Offer
from .chat_message import ChatMessage


class ChatRoom(db.Model):
    __tablename__ = "room_chat"

    id = db.Column(db.Integer, primary_key=True)
    client = db.Column(db.Integer, db.ForeignKey('user.id'),
                       nullable=False)  # Many chatRooms to one client(user)

    offer_id = db.Column(db.Integer, db.ForeignKey('offer.id'),
                         nullable=False)  # Many ChatRooms to one offer
    timestamp = db.Column('timestamp', db.DateTime, nullable=False, default=db.func.current_timestamp())

    messages = db.relationship('ChatMessage',
                               order_by='desc(ChatMessage.timestamp)',
                               lazy='dynamic',
                               backref='chat_room_messages',
                               foreign_keys='ChatMessage.chat_room_id')  # One chatroom has many ChatMasseges

    def to_dict(self):
        data = {
            'id': self.id,
            'client': self.client,
            'offer_owner': self.offer_chat_rooms.user_id,
            'offer_id': self.offer_id,
            'offer_name': self.offer_chat_rooms.name,
            'offer_photo': self.offer_chat_rooms.photo,
            'offer_owner_name': self.offer_chat_rooms.user.name,
            'offer_owner_surname': self.offer_chat_rooms.user.surname,
            'last_message': [message.to_dict() for message in self.messages.limit(1)]
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
    def get_chat_room(client, offer_id):
        return ChatRoom.query \
            .filter(and_(ChatRoom.client == client, ChatRoom.offer_id == offer_id)) \
            .first()

    @staticmethod
    def exists(client, offer_id):
        return ChatRoom.query \
                   .filter(and_(ChatRoom.client == client, ChatRoom.offer_id == offer_id)) \
                   .first() is not None

    @staticmethod
    def get_all_rooms(user_id):
        # .join(ChatMessage,(ChatMessage.chat_room_id == ChatRoom.id) & (ChatMessage.id == max(ChatMessage.id)), isouter=True) \

        return ChatRoom.query \
            .join(Offer) \
            .join(ChatMessage, isouter=True) \
            .filter((user_id == ChatRoom.client) | (user_id == Offer.user_id)) \
            .order_by(nullslast(desc(db.case(
            [(ChatRoom.timestamp > ChatMessage.timestamp, ChatRoom.timestamp)],
            else_= ChatMessage.timestamp))))
        # .order_by(ChatRoom.timestamp.desc(), nullslast(ChatMessage.timestamp.desc()))
        # .group_by(ChatRoom.id)
