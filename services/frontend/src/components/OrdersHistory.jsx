import React, {useEffect, useState} from 'react';
import api from "../api";
import {Button, Card, ListGroupItem} from "react-bootstrap";
import "./OrderHistory.css";
import {BucketFill} from "react-bootstrap-icons";

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
                                    <Button className="cancel-order-button" variant="dark">Cancel</Button>: null
                                }
                                {
                                    !order.accepted ?
                                        <Button className="confirm-button" variant="success">Confirm pick up</Button>: null
                                }
                            </Card.Text>
                            <Card.Text className="view-profile-button"> <Button className="view-button" variant="secondary">View user profile </Button> {order.fromUser_name} {order.fromUser_surname}</Card.Text>
                        </Card.Body>
                    </Card>
                </div>
            )
        })
    );
}

export default OrdersHistory;