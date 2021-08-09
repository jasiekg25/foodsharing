import React, {useEffect, useState} from 'react';
import api from "../api.js";
import {toast} from "react-toastify";
import 'react-chat-elements/dist/main.css';
import { ChatItem } from 'react-chat-elements';
import {history} from "../index";

function ChatRooms() {

    const [chatRooms, setChatRooms] = useState([]);

    useEffect(() => {
        api.getUserChatRooms()
            .then((res) => setChatRooms(res.data))
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
                            subtitle={chat.offer_owner_name}
                            date={new Date()}
                             />
                    </div>
                    )
            })}
        </div>
    );
}

export default ChatRooms;