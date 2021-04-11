import React from 'react';
import {Navbar, Nav} from 'react-bootstrap';
import PropTypes from "prop-types";
import './NavBar.css';


function NavBar(props) {

    let menu = (
        <Nav className="mr-auto">
            <Nav.Link>About us</Nav.Link>
            <Nav.Link>Trust & safety</Nav.Link>
            <Nav.Link href="/login">Log in</Nav.Link>
        </Nav>
    )

    if(props.isAuthenticated()){
        menu = (
            <Nav className="mr-auto">
                <Nav.Link href="/status">User status</Nav.Link>
                <Nav.Link onClick={props.logoutUser}>Log out</Nav.Link>
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