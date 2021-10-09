import React, { useState, useEffect, useCallback } from 'react';
import io from 'socket.io-client';
import api from '../api';

const accessToken = localStorage.getItem('accessToken');
const socket = io.connect(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/notifs`);

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const getMessages = (msg) => {
    const { notification } = msg;
    setNotifications([notification, ...notifications]);
    setUnreadCount(unreadCount + 1);
  };

  const clearUnreadCount = () => {
    setUnreadCount(0);
  };

  useEffect(() => {
    if (notifications.length == 0) {
      api
        .getUserNotifications()
        .then((res) => {
          console.log(res.data)
          setNotifications(
            res.data.map((notif) => {
              return { url: `/user_${notif.user_id}`, message: notif.message };
            })
          );
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  useEffect(() => {
    socket.emit('auth', { accessToken });
    socket.on('notification', getMessages);
    return () => {
      socket.off('notification', getMessages);
    };
  }, [socket, getMessages]);

  return { notifications, unreadCount, clearUnreadCount };
};
