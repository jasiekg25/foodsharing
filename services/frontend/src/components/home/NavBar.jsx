import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import './NavBar.css';
import {Envelope} from "react-bootstrap-icons";


function NavBar(props) {

    let menu = (
        <Nav className="mr-auto">
            <Link
              className="nav-link">About us
            </Link>
            <Link className="nav-link">Trust & safety</Link>
        </Nav>
    )

    if(props.isLoggedIn){
        menu = (
            <Nav className="mr-auto">
                <Link to="/profile" className="nav-link">Profile</Link>
                <Link to="/offers" className="nav-link">Offers</Link>
                <Link to="/add-meal" className="nav-link">Add meal</Link>
                <Link to="/chat" className="nav-link"><Envelope size={18}/></Link>
            </Nav>
        )
    }

    return (
        <Navbar className="navbar-container" expand="lg">
            <Navbar.Brand as={Link} to="/" className="logo">SC</Navbar.Brand>
            <Navbar.Toggle aria-controls="responsive-navbar-nav" />
            <Navbar.Collapse id="responsive-navbar-nav">
                    {menu}
            </Navbar.Collapse>
        </Navbar>
    );
}

NavBar.propTypes = {
    logoutUser: PropTypes.func.isRequired,
    isLoggedIn: PropTypes.bool.isRequired
};

export default NavBar;