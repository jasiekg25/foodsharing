import React, {useState, useEffect, useRef} from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";
import LinearProgress from "@material-ui/core/LinearProgress";
import InfiniteScrollReverse from "react-infinite-scroll-reverse";
import cx from "clsx";
import Grid from "@material-ui/core/Grid";
import CardContent from "@material-ui/core/CardContent";


let endPoint = `${process.env.REACT_APP_BACKEND_SERVICE_URL}/chat`;
const accessToken = localStorage.getItem("accessToken")
let socket = io.connect(`${endPoint}`);
let inputRef = React.createRef();
const useStyles = makeStyles(({ palette }) => ({
    card: {
        marginTop: 10,
        borderRadius: 12,
        textAlign: 'center',
        maxWidth: 900,
        margin: "auto",
        overflow: 'auto',
        scrollbarWidth: "none" /* Firefox */,
        height: "30vh",
        "&::-webkit-scrollbar": {
            width: "9px",
            backgroundColor: "#fff",
        },
        "&::-webkit-scrollbar-track": {
            backgroundColor: "#fff",
        },
        "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#babac0",
            borderRadius: "12px"
        },
        marginBottom: 30
    },
    messages: {
        height: "40vh",
        overflowY: "scroll",
        "&::-webkit-scrollbar": {
            display: "none"
        },
    }
}));


function Chat(props) {
  const {roomId} = props.match.params
  const {offerId} = props.match.params
    const [isOrdered, setIsOrdered] = useState(false);
    const [isMyOffer, setIsMyOffer] = useState(false);
    const [orderHistory, setOrderHistory] = useState([]);
    const [offer, setOffer] = useState({})
    const [userId, setUserId] = useState(-1);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState({from_user_id: userId, message: ""});
  const ref = useRef()

  useEffect(() => {
    socket.emit("join_room", {roomId, offerId, accessToken})
    getMessages();
      return () => {
          socket.off("message")
      }
  }, []);

  useEffect(() =>{
      if(messages.length !== 0){
          ref.current.scrollTop = 9999
      }
  }, [messages])

    const styles = useStyles();


  const getMessages = () => {
    api.getProfile()
            .then((res) => setUserId(res.data.id))
            .catch((err) => {
                toast.error("Could not get user information.")
            })
      api.getChatMessages(roomId, 1)
          .then((res) => {
              setOffer(res.data.offer)
              setMessages(res.data.chat_messages)
              if(res.data.orders.length !== 0) {
                  setIsOrdered(true)
                  setOrderHistory(res.data.orders)
              }
              if(res.data.offer.is_my_offer) setIsMyOffer(true)
          })
          .catch((err) => {
              toast.error("Could not get any messages.")
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
          <Grid container spacing={2} className={styles.card} justifyContent="center">
              <Grid item sm={12} xs={9}>
                  <ChatOffer offerId={offerId} isOrdered={isOrdered} orderHistory={orderHistory} offer={offer} isMyOffer={isMyOffer}/>
              </Grid>
          </Grid>

          <div onKeyPress={handleKeyPress}>
              <div ref={ref} className={styles.messages}>
                  {messages.map((message) => {
                      return (
                          <MessageList
                              className={(message.from_user_id === userId) ? "message-list" : ""}
                              lockable
                              toBottomHeight="100%"
                              dataSource={[
                                  {
                                      position: (message.from_user_id === userId) ? 'right' : 'left',
                                      text: message.message
                                  }
                              ]}
                          />
                  )
                  })}
              </div>
              <div className="modal-footer">
                  <Input
                      className="chat-input"
                      ref={el => (inputRef = el)}
                      onChange={(e) => onChange(e)}
                      placeholder="Type here..."
                      multipleline
                      rightButtons={
                          <IconButton color="primary" onClick={() => sendMessage()}>
                              <SendIcon />
                          </IconButton>
                      }
                  />
              </div>
          </div>
      </div>
  );
}

export default Chat;
