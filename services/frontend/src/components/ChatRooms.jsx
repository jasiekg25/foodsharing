import React, {useEffect, useState} from 'react';
import api from "../api.js";
import {toast} from "react-toastify";
import 'react-chat-elements/dist/main.css';
import { ChatItem } from 'react-chat-elements';
import {history} from "../index";

function ChatRooms() {

    const [chatRooms, setChatRooms] = useState([]);
    const [userId, setUserId] = useState({});


    useEffect(() => {
        api.getProfile()
            .then((res) => setUserId(res.data.id))
            .catch((err) => {
                toast.error("Could not get user information.")
            })
        api.getUserChatRooms()
            .then((res) => {
                res.data.map(room => {
                    if(room.last_message.length > 0){
                        room.message = room.last_message[0].message
                        room.messageTimestamp = room.last_message[0].timestamp
                    }
                })
                setChatRooms(res.data)
                console.log(res.data)
            })
            .catch((err) => {
                toast.error("Could not get any chats.")
            })
    },[])

    const handleShowChat = (roomId, offerId) => {
        history.push(`/chat/${roomId}/offers/${offerId}`)
    }

    return (
        <div>
            {chatRooms.map((chat) => {
                return (
                    <div key={chat.id}>
                        <ChatItem
                            onClick={(e) => handleShowChat(chat.id, chat.offer_id)}
                            avatar={chat.offer_photo}
                            title={chat.offer_name}
                            subtitle= {chat.message}
                            text= {chat.message}
                            date={new Date(chat.messageTimestamp)}
                             />
                    </div>
                    )
            })}
        </div>
    );
}

export default ChatRooms;