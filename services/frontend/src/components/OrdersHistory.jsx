import React, {useEffect, useState} from 'react';
import api from "../api";
import {Button, Card, ListGroupItem} from "react-bootstrap";
import "./OrderHistory.css";
import {BucketFill} from "react-bootstrap-icons";
import {history} from "../index";

function OrdersHistory() {

    const [orderHistory, setOrderHistory] = useState([]);

    useEffect(() => {
        api.getUserOrdersHistory()
            .then((res) => {setOrderHistory(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }, [])

    const handleShowUserProfile = (id) => {
        history.push(`/users/${id}`);
    }

    return (
        orderHistory.map((order) => {
            return (
                <div key={order.id}>
                    <Card className="flex-row">
                        <Card.Body>
                            <Card.Img className="meal-photo" src={order.offer_photo}/>
                        </Card.Body>
                        <Card.Body>
                            <Card.Title className="card-title">{order.offer_name}</Card.Title>
                            <Card.Text>{order.offer_description}</Card.Text>
                            <Card.Text><BucketFill size={15}/>  <strong>Ordered portions: </strong> {order.portions}</Card.Text>
                            <Card.Text className="cancel-confirm-buttons"> {
                                !order.accepted ?
                                    <Button className="order-button" variant="success">Confirm pick up</Button>: null
                                }
                                {
                                    !order.accepted ?
                                        <Button className="cancel-order-button" variant="dark">Cancel</Button>: null
                                }
                            </Card.Text>
                            <Card.Text className="view-profile-button"> <Button className="view-button" variant="secondary" onClick={(e) => handleShowUserProfile(order.fromUser_id)}>View user profile </Button> {order.fromUser_name} {order.fromUser_surname}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            )
        })
    );
}

export default OrdersHistory;