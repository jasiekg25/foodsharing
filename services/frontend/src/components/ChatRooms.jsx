import React, {useEffect, useState} from 'react';
import api from "../api.js";
import {toast} from "react-toastify";
import {Card, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {CalendarFill, EnvelopeFill, TelephoneFill} from "react-bootstrap-icons";
import {history} from "../index";

function ChatRooms(props) {

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
                        <Card>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem onClick={ (e) => handleShowChat(chat.id, chat.offer_id)}> <EnvelopeFill size={20} /> {chat.id}</ListGroupItem>
                             </ListGroup>
                        </Card>
                    </div>
                    )
            })}
        </div>
    );
}

export default ChatRooms;