import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const accessToken = localStorage.getItem("accessToken")
let socket = io.connect("http://localhost:5001/notifs", {reconnection: false, accessToken});

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    getMessages();
  }, [notifications.length]);

  const getMessages = () => {
    socket.on("response", msg => {
      //   let allMessages = messages;
      //   allMessages.push(msg);
      //   setMessages(allMessages);
      console.log(msg.meta)
      setNotifications([...notifications, msg]);
    });
  };

  return (
    <pre>
	{notifications}
    </pre>
  );
};

export default Notifications;