import React, {useRef} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import { makeStyles } from '@material-ui/core/styles';
import { Route, Switch } from 'react-router-dom';

import NavBar from './components/home/NavBar';
import Login from './components/Login';
import Register from './components/Register';
import Image404 from './img/404.svg';
import Home from './components/home/Home';
import About from './components/home/About';
import Rules from './components/home/Rules';
import Footer from './components/home/Footer';
import NewAddMeal from './components/addMeal/NewAddMeal';
import SearchPage from './components/SearchPage';
import FinalizeRegistration from './components/FinalizeRegistration';
import OtherUserProfile from './components/OtherUserProfile';
import Chat from './components/Chat';
import ChatRooms from './components/ChatRooms';
import PrivateRoutes from './components/PrivateRoutes';
import ProfileCard from './components/MediaCard';
import Auth from './components/IsLoggedIn';
import CssBaseline from '@material-ui/core/CssBaseline';
import TimeOut from './components/TimeOut';

const PageNoFound = () => (
  <section className='hero is-halfheight'>
    <div className='hero-body'>
      <div className='container'>
        <h1 className='title has-text-centered'>Oops, Page Not Found!</h1>

        <div className='columns is-flex is-centered'>
          <img src={Image404} width='50%' alt='404 Page Not Found' />
        </div>
      </div>
    </div>
  </section>
);

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
  },
}));

const App = () => {
  const classes = useStyles();
  const aboutRef = useRef()
  const rulesRef = useRef()
  return (
    <Auth>
      <div className={classes.root}>
        <CssBaseline />

        <ToastContainer position='top-center' />
        <div>
          <NavBar aboutRef={aboutRef} rulesRef={rulesRef} />

          <Switch>
            <Route
              exact
              path='/'
              render={() => (
                <div>
                  <Home />
                  <About aboutRef={aboutRef} />
                  <Rules rulesRef={rulesRef} />
                </div>
              )}
            />
            <Route exact path='/login' render={() => <Login />} />
            <Route exact path='/register' render={() => <Register />} />
            <Route path='/finalize' component={FinalizeRegistration} />
            <Route exact path='/timeout' component={TimeOut} />
            <PrivateRoutes>
              <Route exact path='/offers' render={() => <SearchPage />} />
              <Route exact path='/add-meal' render={() => <NewAddMeal />} />
              <Route
                exact
                path='/users/:id'
                render={(props) => <OtherUserProfile {...props} />}
              />
              <Route exact path='/chat' render={() => <ChatRooms />} />
              <Route exact path='/profile' render={() => <ProfileCard />} />
              <Route
                exact
                path='/chat/:roomId/offers/:offerId'
                render={(props) => <Chat {...props} />}
              />
            </PrivateRoutes>
            <Route component={PageNoFound} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Auth>
  );
};

export default App;
