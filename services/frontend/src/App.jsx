import React, {Component} from "react";
import axios from "axios";
import {Route, Switch} from 'react-router-dom';
import api from "./api"

import NavBar from './components/NavBar';
import UserStatus from './components/UserStatus';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Message from './components/Message';
import Image404 from './img/404.svg';
import TimeOut from "./components/TimeOut";


const PageNoFound = () => (
  <section className="hero is-halfheight">
    <div className="hero-body">
      <div className="container">

        <h1 className="title has-text-centered">Oops, Page Not Found!</h1>

        <div class="columns is-flex is-centered">

          <img src={Image404} width="50%" alt="404 Page Not Found" />

        </div>
      </div>
    </div>
  </section>
);

class App extends Component {
  constructor() {
    super();

    this.state = {
      messageType: null,
      messageText: null,
    };
  }

  componentDidMount() {
    this.refreshToken();
  }

  refreshToken() {
    axios
    .get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/refresh`)
    .catch()
  }

  handleRegisterFormSubmit = (data) => {
    api.register(data)
    .then((res) => {
      console.log(res.data);
      this.createMessage('success', 'You have registered successfully.');
      return true
    })
    .catch((err) => { 
      console.log(err); 
      this.createMessage('danger', 'That user already exists.');
      return false
    });
  };

  handleLoginFormSubmit = (data) => {
    api.login(data)
    .then((res) => {
      window.localStorage.setItem('accessToken', res.data.access_token);
      this.createMessage('success', 'You have logged in successfully.');
      return true
    })
    .catch((err) => { 
      console.log(err); 
      this.createMessage('danger', 'Incorrect email and/or password.');
      return false
    });
  };

  isAuthenticated = () => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      return true;
    }
    return false;
  };

  logoutUser = () => {
    window.localStorage.removeItem('accessToken');
    this.createMessage('success', 'You have logged out.');
  };

  createMessage = (type, text) => {
    this.setState({
      messageType: type,
      messageText: text,
    });
    setTimeout(() => {
        this.removeMessage();
      }, 3000);
  };

  removeMessage = () => {
    this.setState({
      messageType: null,
      messageText: null,
    });
  };


  render() {
    return (
      <div>
        <NavBar
          logoutUser={this.logoutUser}
          isAuthenticated={this.isAuthenticated}
        />


        {this.state.messageType && this.state.messageText &&
          <Message
            messageType={this.state.messageType}
            messageText={this.state.messageText}
            removeMessage={this.removeMessage}
          />}

        <Switch>
          <Route
            exact
            path='/'
            render={() => (
              <div>
              </div>
            )} />
          <Route
            exact
            path="/register"
            render={() => (
              <RegisterForm
                // eslint-disable-next-line react/jsx-handler-names
                handleRegisterFormSubmit={this.handleRegisterFormSubmit}
                isAuthenticated={this.isAuthenticated}
              />
            )}
          />

          <Route
            exact
            path='/login'
            render={() => (
              <LoginForm
                // eslint-disable-next-line react/jsx-handler-names
                handleLoginFormSubmit={this.handleLoginFormSubmit}
                isAuthenticated={this.isAuthenticated}
              />
            )}
          />
          <Route
            exact
            path="/status"
            render={() => (
              <UserStatus
                accessToken={this.state.accessToken}
                isAuthenticated={this.isAuthenticated}
              />

            )}
          />
          <Route exact path="/timeout" render={() =>
            <TimeOut createMessage={this.createMessage} />
          } />
          <Route component={PageNoFound} />
        </Switch>
      </div>
    );
  }
}

export default App;
