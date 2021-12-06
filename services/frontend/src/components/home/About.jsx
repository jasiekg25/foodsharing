import React from 'react';
import {Row, Col, Image} from "react-bootstrap";
import sharing from "../../img/sharing.jpg";
import "./About.css";

function About({aboutRef}) {
    return (
        <div ref={aboutRef} className="about-container">
            <h4 className="about-title">About us</h4>
            <Row>
                <Col md={7}>
                    <h1 className="sharing-text">Sharing is caring.</h1>
                </Col>
                <Col className="about-text" md={4}>
                    <h5>"Here at SchabCoin, we say no to the wasteful, throw-away society driven by consumerism. Every
                        year, in the US alone, $43 billion worth of edible food is estimated to be thrown away. Our goal
                        is to create a community where you can share your food for free and meet like-minded people, as
                        we all take a small step towards ending hunger, poverty, and climate change." </h5>
                </Col>
            </Row>
            <div className="photo-container">
                <Image src={sharing} fluid/>
            </div>
        </div>
    );
}

export default About;