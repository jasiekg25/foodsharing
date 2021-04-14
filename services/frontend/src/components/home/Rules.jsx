import React from 'react';
import {Col, Card, Row} from "react-bootstrap";
import "./Rules.css";


function Rules(props) {
    return (
        <Row>
            <div className="rules-container">
                <h4 className="rules-title">Trust & safety</h4>
                <h5 className="rules-text">Food safety is extremely important to take into account when sharing surplus
                    food and both the person giving the food and the person picking the food up should always take the
                    following into account:</h5>
                <Row className="cards-container">
                    <Col md={4}>
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="rule-number">#1</Card.Title>
                                <Card.Text>
                                    Only add food that you would be willing to eat yourself. Any person giving away food
                                    must not give away food they believe is unsafe to eat.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={4}>
                        <Card className="card">
                            <Card.Body>
                                <Card.Title className="rule-number">#2</Card.Title>
                                <Card.Text>
                                    Any person requesting food is responsible for asking the questions that give them
                                    the comfort that food is safe to eat.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </Row>
    );
}

export default Rules;