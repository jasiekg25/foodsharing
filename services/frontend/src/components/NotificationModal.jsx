import React, { useEffect, useState } from 'react';
import {
  Badge,
  IconButton,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  MenuItem,
} from '@material-ui/core';
import NotificationsIcon from '@material-ui/icons/Notifications';
import { useNotifications } from '../hooks/useNotifications';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import api from '../api';

const useStyles = makeStyles((theme) => ({
  typography: {
    padding: theme.spacing(2),
  },
}));

const ListItemLink = (props) => {
  return <ListItem button component={Link} {...props} />;
};

const NotificationModal = ({ isMenu = false }) => {
  const classes = useStyles();
  const { notifications, unreadCount, clearUnreadCount } = useNotifications();
  const [anchorEl, setAnchorEl] = useState(null);

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    clearUnreadCount();
  };

  return (
    <>
      {isMenu ? (
        <MenuItem onClick={handleClick}>
          <ListItemIcon style={{ minWidth: '30px' }} color='inherit'>
            <Badge badgeContent={unreadCount}>
              <NotificationsIcon />
            </Badge>
          </ListItemIcon>
          <ListItemText>Notifications</ListItemText>
        </MenuItem>
      ) : (
        <IconButton onClick={handleClick} color='inherit'>
          <Badge badgeContent={unreadCount}>
            <NotificationsIcon />
          </Badge>
        </IconButton>
      )}

      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <List component='nav' aria-label='secondary mailbox folders'>
          {notifications.length === 0 ? (
            <ListItem button>
              <ListItemText primary='No notifications' />
            </ListItem>
          ) : (
            notifications.map((notif) => (
              <ListItemLink button to={notif.url}>
                <ListItemText primary={notif.message} />
              </ListItemLink>
            ))
          )}
        </List>
      </Popover>
    </>
  );
};

export default NotificationModal;
