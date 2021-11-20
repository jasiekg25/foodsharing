import { Link, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import './NavBar.css';
import NotificationModal from '../NotificationModal';
import React from 'react';
import { alpha, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import Button from '@material-ui/core/Button';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import ChatIcon from '@material-ui/icons/Chat';
import { useAuth } from '../IsLoggedIn';

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
    marginRight: theme.spacing(2),
    cursor: 'pointer',
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing(3),
      width: 'auto',
    },
  },
  searchIcon: {
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
  },
  inputInput: {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch',
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  menuButton: {
    margin: theme.spacing(1),
    color: 'inherit',
  },
}));

export default function PrimarySearchAppBar() {
  const { isLoggedIn, logOut } = useAuth();
  const history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const menuId = 'primary-search-account-menu';
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      id={menuId}
      keepMounted
      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      <MenuItem
        onClick={() => {
          handleMenuClose();
          history.push('/profile');
        }}
      >
        <ListItemIcon style={{ minWidth: '30px' }}>
          <AccountCircle />
        </ListItemIcon>
        <ListItemText>Profile</ListItemText>
      </MenuItem>
      <MenuItem
        onClick={() => {
          handleMenuClose();
          logOut();
        }}
      >
        <ListItemIcon style={{ minWidth: '30px' }}>
          <ExitToAppIcon />
        </ListItemIcon>
        <ListItemText>Log out</ListItemText>
      </MenuItem>
    </Menu>
  );

  const mobileMenuId = 'primary-search-account-menu-mobile';

  let menu = (
    <>
      <div className={classes.sectionDesktop}>
        <Button className={classes.menuButton}>About us</Button>
        <Button className={classes.menuButton}>Trust & safety</Button>
      </div>
      <div className={classes.grow} />
      <Button
        className={classes.menuButton}
        onClick={() => {
          history.push('/login');
        }}
      >
        Log in
      </Button>
    </>
  );

  if (isLoggedIn) {
    menu = (
      <>
        <Button
          className={classes.menuButton}
          onClick={() => {
            history.push('/offers');
          }}
        >
          Offers
        </Button>
        <Button
          className={classes.menuButton}
          onClick={() => {
            history.push('/add-meal');
          }}
        >
          Add meal
        </Button>
        <div className={classes.grow} />
        <div className={classes.sectionDesktop}>
          <IconButton
            aria-label='chat'
            aria-controls={menuId}
            aria-haspopup='true'
            onClick={() => {
              history.push('/chat');
            }}
            color='inherit'
          >
            <ChatIcon />
          </IconButton>
          <NotificationModal />
          <IconButton
            edge='end'
            aria-label='account of current user'
            aria-controls={menuId}
            aria-haspopup='true'
            onClick={handleProfileMenuOpen}
            color='inherit'
          >
            <AccountCircle />
          </IconButton>
        </div>
      </>
    );
  }

  const renderMobileMenu = (
    <>
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        id={mobileMenuId}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={handleMobileMenuClose}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            history.push('/profile');
          }}
        >
          <ListItemIcon style={{ minWidth: '30px' }}>
            <AccountCircle />
          </ListItemIcon>
          <ListItemText>Profile</ListItemText>
        </MenuItem>

        <NotificationModal isMenu={true} />

        <MenuItem >
          <ListItemIcon
            aria-label='chat'
            aria-controls={menuId}
            aria-haspopup='true'
            onClick={() => {
              history.push('/chat');
            }}
            color='inherit'
            style={{ minWidth: '30px' }}
          >
            <ChatIcon />
          </ListItemIcon>
          <ListItemText>Chat</ListItemText>
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleMenuClose();
            logOut();
          }}
        >
          <ListItemIcon style={{ minWidth: '30px' }}>
            <ExitToAppIcon />
          </ListItemIcon>
          <ListItemText>Log out</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );

  return (
    <div className={classes.grow}>
      <AppBar position='static'>
        <Toolbar>
          <Typography
            className={classes.title}
            onClick={() => {
              history.push('/');
            }}
            variant='h6'
            noWrap
          >
            SchabCoin
          </Typography>
          {menu}
          <div className={classes.sectionMobile}>
            <IconButton
              aria-label='show more'
              aria-controls={mobileMenuId}
              aria-haspopup='true'
              onClick={handleMobileMenuOpen}
              color='inherit'
            >
              <MoreIcon />
            </IconButton>
          </div>
        </Toolbar>
      </AppBar>
      {renderMobileMenu}
      {renderMenu}
    </div>
  );
}
