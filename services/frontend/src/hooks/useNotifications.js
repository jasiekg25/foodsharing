import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const accessToken = localStorage.getItem("accessToken")
let socket = io.connect(`http://localhost:5001/notifs`);

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    socket.emit("auth", {accessToken});
  }, [])

  useEffect(() => {
    getMessages();
  }, [notifications.length]);

  const getMessages = () => {
    socket.on("notification", msg => {
      const {notification} = msg
      console.log(notification)
      setNotifications([...notifications, notification]);
      setUnreadCount(unreadCount + 1)
    });
  };

  const clearUnreadCount = () => {
    setUnreadCount(0)
  }

  return {notifications, unreadCount, clearUnreadCount}
}

