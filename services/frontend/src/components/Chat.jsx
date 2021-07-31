import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../api";
import {toast} from "react-toastify";
import {set} from "react-hook-form";

let endPoint = "http://localhost:5001/chat";
const accessToken = localStorage.getItem("accessToken")
let socket = io.connect(`${endPoint}`);

function Chat(props) {
  const {roomId} = props.match.params
  const {offerId} = props.match.params
  const [userId, setUserId] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({from_user_id: userId, message: ""});

  useEffect(() => {
    socket.emit("join_room", {roomId, offerId, accessToken})
    getMessages();
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

  socket.on("message", data => {
      const mess = {message: data, from_user_id: userId}
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
      socket.emit("message", {roomId, accessToken, message});
      const mess = {from_user_id: userId, message: ""}
      setMessage(mess)
    } else {
      alert("Please Add A Message");
    }
  };


  return (
    <div>
      {messages.map((message) => {
        return (
            <div>
              <p>{message.message}</p>
            </div>
        )
      })}
      <input value={message.message} name="message" onChange={e => onChange(e)} />
      <button onClick={() => onClick()}>Send Message</button>
    </div>
  );
}

export default Chat;