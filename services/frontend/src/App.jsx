import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import api from "./api";
import "bootstrap/dist/css/bootstrap.min.css";
import { history } from "./index";
import { ToastContainer, toast } from 'react-toastify';

import NavBar from "./components/home/NavBar";
import Login from "./components/Login";
import Register from "./components/Register";
import Image404 from "./img/404.svg";
import Home from "./components/home/Home";
import About from "./components/home/About";
import Rules from "./components/home/Rules";
import Footer from "./components/home/Footer";
import AddMeal from "./components/AddMeal";
import SearchPage from "./components/SearchPage";
import Profile from "./components/Profile";
import FinalizeRegistration from "./components/FinalizeRegistration";
import OtherUserProfile from "./components/OtherUserProfile";
import Chat from "./components/Chat";
import ChatRooms from "./components/ChatRooms";

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
  const [isLoggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    setLoggedIn(token ? true : false);

    api.refreshToken();
  }, []);

  const handleLoginFormSubmit = (data) => {
    api
      .login(data)
      .then((res) => {
        window.localStorage.setItem("accessToken", res.data.access_token);
        toast.success("You have logged in successfully.")
        setLoggedIn(true);
        return true;
      })
      .catch((err) => {
        console.log(err);
        toast.error("Incorrect email and/or password.")
        return false;
      });
  };

  const logoutUser = () => {
    window.localStorage.removeItem("accessToken");
    setLoggedIn(false);
    toast.success("You have logged out.")
  };

  const tokenTimeout = () => {
    localStorage.removeItem("accessToken");
    console.log("Elapsed token removed!");
    toast.error("Session elapsed. You need to log in again")
    setLoggedIn(false);
    history.push("/login");
  };

  return (
    <div>
      <NavBar isLoggedIn={isLoggedIn} logoutUser={logoutUser} />

      <ToastContainer position="top-center"/>

      <Switch>
        <Route
          exact
          path="/"
          render={() => (
            <div>
              <Home isLoggedIn={isLoggedIn} />
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
              isLoggedIn={isLoggedIn}
            />
          )}
        />
        <Route
          path="/finalize"
          component={FinalizeRegistration}
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
        {/* <Route
          exact
          path="/offers"
          render={() => <Offers isLoggedIn={isLoggedIn} />}
        /> */}
        <Route
          exact
          path="/offers"
          render={() => <SearchPage isLoggedIn={isLoggedIn} />}
        />
        <Route
          exact
          path="/add-meal"
          render={() => <AddMeal isLoggedIn={isLoggedIn} />}
        />
        <Route
            exact
            path="/profile"
            render={() => <Profile isLoggedIn={isLoggedIn} logoutUser={logoutUser} />}
        />
          <Route
              exact
              path="/users/:id"
              render={(props) => <OtherUserProfile {...props} />}
          />
          <Route
            exact
            path="/chat"
            render={() => <ChatRooms />}
        />
        <Route
              exact
              path="/chat/:roomId/offers/:offerId"
              render={(props) => <Chat {...props} />}
          />
        <Route component={PageNoFound} />
      </Switch>
      <Footer />
    </div>
  );
};

export default App;
