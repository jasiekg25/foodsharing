import React, {useEffect, useState} from 'react';
import api from "../api";
import {Button, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {AlarmFill, BucketFill, ClockFill, GeoAltFill, Tag, TagFill} from "react-bootstrap-icons";

function UserOffers(props) {
    const [userOffers, setUserOffers] = useState([]);

    useEffect(() => {
        api.getUserCurrentOffers()
            .then((res) => {setUserOffers(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }, [])

    return (
        userOffers.map((offer) => {
            return (
                <div key={offer.id}>
                    <Card className="flex-row">
                        <Card.Body>
                            <Card.Img className="meal-photo" src={offer.photo} />
                        </Card.Body>
                        <Card.Body>
                            <Card.Title>{offer.name}</Card.Title>
                            <Card.Text>{offer.description}</Card.Text>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem> <BucketFill size={15}/>  <strong>Remaining portions: </strong> {offer.portions_number}</ListGroupItem>
                                <ListGroupItem> <GeoAltFill size={15}/> <strong> Pick-up localization: </strong> {offer.pickup_localization}</ListGroupItem>
                                <ListGroupItem> <ClockFill size={15}/> <strong> Pick-up times: </strong> {offer.pickup_times}</ListGroupItem>
                                <ListGroupItem> <AlarmFill size={15}/> <strong> Expire date: </strong> {offer.offer_expiry} </ListGroupItem>
                                <ListGroupItem> <TagFill size={15}/> <strong>Tags: </strong> {Array.from(offer.tags).map((tag, index) => {
                                     return (<small key={index}>{tag}, </small>);
                                })}
                                </ListGroupItem>
                            </ListGroup>
                            <Card.Text className="cancel-confirm-buttons">
                                <Button className="order-button" variant="success">Edit</Button>
                                <Button className="cancel-order-button" variant="dark">Delete</Button>
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            )
        })
    );
}

export default UserOffers;
