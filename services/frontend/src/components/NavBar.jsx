import React from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const NavBar = props => {
  let menu = (
    <div className="navbar-end">
      <Link
        to="/register"
        className="navbar-item is-secondary"
        data-testid="nav-register"
      >
        Register
      </Link>
      <Link
        to="/login"
        className="navbar-item is-secondary"
        data-testid="nav-login"
      >
        Log In
      </Link>
    </div>
  );
  if (props.isAuthenticated()) {
    menu = (
      <div className="navbar-end">
        <Link
          to="/status"
          className="navbar-item is-secondary"
          data-testid="nav-status"
        >
          User Status
        </Link>
        <span
          onClick={props.logoutUser}
          className="navbar-item link"
          data-testid="nav-logout"
        >
          Log Out
        </span>
      </div>
    );
  }
  return (
    <nav
      className="navbar is-fresh is-transparent no-shadow"
      role="navigation"
      aria-label="main navigation"
    >
      <section className="container">
        <div id="navbar-menu" className="navbar-menu is-static">
          {menu}
        </div>
      </section>
    </nav>
  );
};

NavBar.propTypes = {
  logoutUser: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default NavBar;
