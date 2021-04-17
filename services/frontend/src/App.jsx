import React, { useState, useEffect } from "react";
import axios from "axios";
import { Route, Switch } from "react-router-dom";
import api from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import { history } from "./index";

import NavBar from "./components/home/NavBar";
import UserStatus from "./components/UserStatus";
import Login from "./components/Login";
import Register from "./components/Register";
import Message from "./components/Message";
import Image404 from "./img/404.svg";
import Home from "./components/home/Home";
import About from "./components/home/About";
import Rules from "./components/home/Rules";
import Footer from "./components/home/Footer";
import Offers from "./components/Offers";
import AddMeal from "./components/AddMeal";

const PageNoFound = () => (
  <section className="hero is-halfheight">
    <div className="hero-body">
      <div className="container">
        <h1 className="title has-text-centered">Oops, Page Not Found!</h1>

        <div className="columns is-flex is-centered">
          <img src={Image404} width="50%" alt="404 Page Not Found" />
        </div>
      </div>
    </div>
  </section>
);

const App = () => {
  const [message, setMessage] = useState({
    messageType: null,
    messageText: null,
  });

  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoggedIn(token ? true : false);

    api.refreshToken();
  }, []);

  const handleRegisterFormSubmit = (data) => {
    api
      .register(data)
      .then((res) => {
        console.log(res.data);
        createMessage("success", "You have registered successfully.");
        return true;
      })
      .catch((err) => {
        console.log(err);
        createMessage("danger", "That user already exists.");
        return false;
      });
  };

  const handleLoginFormSubmit = (data) => {
    api
      .login(data)
      .then((res) => {
        window.localStorage.setItem("accessToken", res.data.access_token);
        createMessage("success", "You have logged in successfully.");
        setLoggedIn(true);
        return true;
      })
      .catch((err) => {
        console.log(err);
        createMessage("danger", "Incorrect email and/or password.");
        return false;
      });
  };

  const logoutUser = () => {
    window.localStorage.removeItem("accessToken");
    setLoggedIn(false);
    createMessage("success", "You have logged out.");
  };

  const createMessage = (type, text) => {
    setMessage({
      messageType: type,
      messageText: text,
    });
    setTimeout(() => {
      removeMessage();
    }, 3000);
  };

  const removeMessage = () => {
    setMessage({
      messageType: null,
      messageText: null,
    });
  };

  const tokenTimeout = () => {
    localStorage.removeItem("accessToken");
    console.log("Elapsed token removed!");
    createMessage("danger", "Session elapsed. You need to log in again");
    setLoggedIn(false);
    history.push("/login");
  };

  return (
    <div>
      <NavBar logoutUser={logoutUser} isLoggedIn={isLoggedIn} />

      {message.messageType && message.messageText && (
        <Message
          messageType={message.messageType}
          messageText={message.messageText}
          removeMessage={removeMessage}
        />
      )}

      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <div>
              <Home />
              <About />
              <Rules />
            </div>
          )}
        />
        <Route
          exact
          path="/register"
          render={() => (
            <Register
              // eslint-disable-next-line react/jsx-handler-names
              onSubmit={(data) => console.log(data)}
              isLoggedIn={isLoggedIn}
            />
          )}
        />
        <Route
          exact
          path="/login"
          render={() => (
            <Login
              // eslint-disable-next-line react/jsx-handler-names
              onSubmit={handleLoginFormSubmit}
              isLoggedIn={isLoggedIn}
            />
          )}
        />
        <Route exact path="/timeout" render={() => tokenTimeout()} />
        <Route
          exact
          path="/status"
          render={() => <UserStatus isLoggedIn={isLoggedIn} />}
        />
        <Route
          exact
          path="/offers"
          render={() => <Offers isLoggedIn={isLoggedIn} />}
        />
        <Route
          exact
          path="/add-meal"
          render={() => <AddMeal 
            isLoggedIn={isLoggedIn}
           />}
        />
        <Route component={PageNoFound} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
