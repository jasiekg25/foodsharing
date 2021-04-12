import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import './NavBar.css';


function NavBar(props) {

    let menu = (
        <Nav className="mr-auto">
            <Link className="nav-link">About us</Link>
            <Link className="nav-link">Trust & safety</Link>
            <Link to="/login" className="nav-link">Log in</Link>
        </Nav>
    )

    if(props.isAuthenticated()){
        menu = (
            <Nav className="mr-auto">
                <Link to="/status" className="nav-link">User status</Link>
                <Link onClick={props.logoutUser}  className="nav-link">Log out</Link>
            </Nav>
        )
    }

    return (
        <Navbar className="navbar-container" expand="lg">
            <Navbar.Brand className="logo">SC</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                <Nav className="mr-auto">
                    {menu}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

NavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.func.isRequired
};

export default NavBar;