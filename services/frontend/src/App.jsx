import React, {Component} from "react";
import axios from "axios";
import {Route, Switch} from 'react-router-dom';


import NavBar from './components/NavBar';
import Home from './components/Home';
import RandomQuotes from './components/RandomQuotes';
import UserStatus from './components/UserStatus';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Message from './components/Message';
import AddUser from "./components/AddUser";
import Image404 from './img/404.svg';


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
      users: [],
      random_quotes: [],
      accessToken: null,
      messageType: null,
      messageText: null,
    };
  }

  componentDidMount() {
    this.getUsers();
    this.getRandomQuotes();
  }

  getUsers = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/users`).then(res => {
      this.setState({users: res.data});
    }).catch(err => {
      console.log(err);
    });
  }

  getRandomQuotes = () => {
    axios.get(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/quotes/random`).then(res => {
      this.setState({random_quotes: res.data});
    }).catch(err => {
      console.log(err);
    });
  }

  addUser = (data) => {
    axios
      .post(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/users`, data)
      .then(res => {
        this.getUsers();
        this.setState({ username: "", email: "" });
        this.handleCloseModal();
        this.createMessage('success', 'User added.');
      })
      .catch(err => {
        console.log(err);
        this.handleCloseModal();
        this.createMessage('danger', 'That user already exists.');
      });
  }

  removeUser = (user_id) => {
  axios.delete(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/users/${user_id}`,)
  .then((res) => {
    this.getUsers();
    this.createMessage('success', 'User removed.');
  })
  .catch((err) => {
    console.log(err);
    this.createMessage('danger', 'Something went wrong.');
  });
};


  handleRegisterFormSubmit = (data) => {
  const url = `${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/register`
  axios.post(url, data)
  .then((res) => {
    console.log(res.data);
    this.createMessage('success', 'You have registered successfully.');
  })
  .catch((err) => { console.log(err); });
  this.createMessage('danger', 'That user already exists.');
};

handleLoginFormSubmit = (data) => {
  const url = `${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/login`
  axios.post(url, data)
  .then((res) => {
    this.setState({ accessToken: res.data.access_token });
    this.getUsers();
    window.localStorage.setItem('refreshToken', res.data.refresh_token);
    this.createMessage('success', 'You have logged in successfully.');
  })
  .catch((err) => { console.log(err); });
  this.createMessage('danger', 'Incorrect email and/or password.');
};

validRefresh = () => {
  const token = window.localStorage.getItem('refreshToken');
  if (token) {
    axios
    .post(`${process.env.REACT_APP_BACKEND_SERVICE_URL}/auth/refresh`, {
      refresh_token: token
    })
    .then(res => {
      this.setState({ accessToken: res.data.access_token });
      this.getUsers();
      window.localStorage.setItem('refreshToken', res.data.refresh_token);
      return true;
    })
    .catch(err => {
      return false;
    });
  }
  return false;
};

isAuthenticated = () => {
  if (this.state.accessToken || this.validRefresh()) {
    return true;
  }
  return false;
};

logoutUser = () => {
  window.localStorage.removeItem('refreshToken');
  this.setState({ accessToken: null });
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
                <Home />
                <RandomQuotes
                  random_quotes={this.state.random_quotes}
                />

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
          <Route
            component={PageNoFound}

          />

        </Switch>
      </div>
    );
  }
}

export default App;
