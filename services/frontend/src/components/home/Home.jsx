import React from 'react';
import './Home.css';
import {Button, Row, Col} from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from '../IsLoggedIn';

function Home() {
    const { isLoggedIn } = useAuth();
    let loginButton = isLoggedIn ? null : (
      <Button
        as={Link}
        to='/login'
        className='home-login-button'
        variant='dark'
      >
        Log in
      </Button>
    );

    return (
        <Row className="home-container">
            <Col md={4} className="home-text ">
                <h1 className="mb-3">SchabCoin</h1>
                <h4 className="mb-3">Great satisfaction comes from sharing with others.</h4>
                {loginButton}
            </Col>
        </Row>
    );
}

export default Home;
