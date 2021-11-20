import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import api from "../api";
import {toast} from "../utils/toastWrapper";
import 'react-chat-elements/dist/main.css';
import { Input, Button, MessageList } from 'react-chat-elements';
import "./Chat.css"
import SendIcon from '@material-ui/icons/Send';
import IconButton from "@material-ui/core/IconButton";
import ChatOffer from "./ChatOffer";
import {Card} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

let endPoint = `${process.env.REACT_APP_BACKEND_SERVICE_URL}/chat`;
const accessToken = localStorage.getItem("accessToken")
let socket = io.connect(`${endPoint}`);
let inputRef = React.createRef();
const useStyles = makeStyles(({ palette }) => ({
    card: {
        marginTop: 10,
        margin:"auto",
        borderRadius: 12,
        width: 700,
        textAlign: 'center',
        overflow: 'auto',
        scrollbarWidth: "none" /* Firefox */,
        maxHeight: 200,
        "&::-webkit-scrollbar": {
            display: "none"
        }
    }
}));


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

    const styles = useStyles();

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
  const sendMessage = () => {
    if (message.message !== "") {
      socket.emit("message", {roomId, accessToken, message, userId});
      const mess = {from_user_id: userId, message: ""}
      setMessage(mess);
      inputRef.clear();
    } else {
      toast.info("Please add a message");
    }
  };

   const handleKeyPress = (e) => {
        if(e.key === 'Enter'){
            sendMessage()
        }
    }


  return (
      <div>
          <Card className={styles.card}>
              <ChatOffer offerId={offerId}/>
          </Card>
          <div onKeyPress={handleKeyPress}>
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
                      <IconButton color="primary" onClick={() => sendMessage()}>
                          <SendIcon/>
                      </IconButton>
                  }/>
          </div>
      </div>
  );
}

export default Chat;
