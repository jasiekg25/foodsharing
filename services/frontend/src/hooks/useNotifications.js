import React, { useState, useEffect, useCallback } from "react";
import io from "socket.io-client";
import api from "../api";

const accessToken = localStorage.getItem("accessToken");
let socket = io.connect(`http://localhost:5001/notifs`);

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const getMessages = useCallback((msg) => {
    const { notification } = msg;
    setNotifications([notification, ...notifications]);
    setUnreadCount(unreadCount + 1);
  });


  const clearUnreadCount = useCallback(() => {
    setUnreadCount(0);
  });

  useEffect(() => {
    if (notifications.length == 0){
      api.getUserNotifications()
      .then((res) => {
        setNotifications(res.data.map(notif => {return {"url": `/user_${notif.user_id}` , "message": notif.message};}))
      })
      .catch((err) => {
          console.log(err);
      })
    }
    socket.emit("auth", { accessToken });
    socket.on("notification", getMessages);
    return () => {
      socket.off("notification", getMessages)
    }
  }, [socket, getMessages]);

  return { notifications, unreadCount, clearUnreadCount };
};
