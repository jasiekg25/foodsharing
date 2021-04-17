import React, {useEffect, useState} from 'react';
import api from "../api.js";
import {Col, Card, Row, Button} from "react-bootstrap";
import "./Offers.css";
import {Redirect} from "react-router-dom";

function Offers({isLoggedIn}) {

    const [offers, setOffers] = useState([]);

    useEffect(() => {
        api.getOffers()
            .then((res) => {
                setOffers(res.data);
            })
    }, [])

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    return (
        offers.map((offer) => {
            return (
                <div>
                    <Row className="offers-container">
                        <Col md={4}>
                            <Card className="offer-card">
                                <Card.Body>
                                    <Card.Title>{offer.name}</Card.Title>
                                    <Card.Text>
                                        {offer.description}
                                    </Card.Text>
                                    <Card.Text>
                                        {offer.pickup_localization}
                                    </Card.Text>
                                    <Card.Text>
                                        {offer.pickup_times}
                                    </Card.Text>
                                    <Card.Text>
                                        {offer.offer_expiry}
                                    </Card.Text>
                                    <Card.Text>
                                        {offer.portions_number}
                                    </Card.Text>
                                    <Card.Text>
                                        {offer.user_name}
                                    </Card.Text>
                                    <Button className="order-button" type="submit" variant="success">Order</Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </div>
            )
        })
    );
}

export default Offers;