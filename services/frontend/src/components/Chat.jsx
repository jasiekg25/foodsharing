import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../api";
import {toast} from "react-toastify";
import 'react-chat-elements/dist/main.css';
import { Input, Button, MessageList } from 'react-chat-elements';
import "./Chat.css"

let endPoint = "http://localhost:5001/chat";
const accessToken = localStorage.getItem("accessToken")
let socket = io.connect(`${endPoint}`);
let inputRef = React.createRef();

function Chat(props) {
  const {roomId} = props.match.params
  const {offerId} = props.match.params
  const [userId, setUserId] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({from_user_id: userId, message: ""});

  useEffect(() => {
    socket.emit("join_room", {roomId, offerId, accessToken})
    getMessages();
      return () => {
          socket.off("message")
      }
  }, []);

  const getMessages = () => {
    api.getChatMessages(roomId)
            .then((res) => setMessages(res.data))
            .catch((err) => {
                toast.error("Could not get any messages.")
            })
    api.getProfile()
            .then((res) => setUserId(res.data.id))
            .catch((err) => {
                toast.error("Could not get user information.")
            })
  };

  socket.on("message", (data) => {
      const mess = {message: data.message.message, from_user_id: data.userId}
      setMessages([...messages, mess]);
    });

  // On Change
  const onChange = e => {
    const mess = {from_user_id: userId, message: e.target.value}
    setMessage(mess)
  };

  // On Click
  const onClick = () => {
    if (message.message !== "") {
      socket.emit("message", {roomId, accessToken, message, userId});
      const mess = {from_user_id: userId, message: ""}
      setMessage(mess);
      inputRef.clear();
    } else {
      toast.info("Please add a message");
    }
  };


  return (
    <div>
      {messages.map((message) => {
        return (
            <MessageList
                className={(message.from_user_id === userId) ? "message-list" : ""}
                lockable={true}
                toBottomHeight={'100%'}
                dataSource={[
                    {
                        position: (message.from_user_id === userId) ? 'right' : 'left',
                        text: message.message
                    }
                ]
                } />
        )
      })}
        <Input
            className="chat-input"
            ref={el => (inputRef = el)}
            onChange={(e) => onChange(e)}
            placeholder="Type here..."
            multipleline={true}
            rightButtons={
                <Button
                    onClick={() => onClick()}
                    color='white'
                    backgroundColor='black'
                    text='Send'/>
            }/>
    </div>
  );
}

export default Chat;