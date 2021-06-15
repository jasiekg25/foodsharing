import React, {useEffect, useState} from 'react';
import api from "../api";
import {Button, Card, ListGroupItem, Modal} from "react-bootstrap";
import "./OrderHistory.css";
import {BagCheckFill, BagXFill, BucketFill} from "react-bootstrap-icons";
import {history} from "../index";
import placeholder from "../img/placeholder.jpg";
import {toast} from "react-toastify";

function OrdersHistory() {

    const [orderHistory, setOrderHistory] = useState([]);
    const [chosenOrder, setChosenOrder] = useState({});
    const [showCancelOrderModal, setShowCancelOrderModal] = useState(false);
    const [showConfirmPickupModal, setShowConfirmPickupModal] = useState(false);

    useEffect(() => {
        getOrders();
    }, [])

    const getOrders = () => {
        api.getUserOrdersHistory()
            .then((res) => {setOrderHistory(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user orders" + err.message);
            })
    }

    const handleCancelOrderClose = () => {
        setShowCancelOrderModal(false);
    }
    const handleCancelOrderShow = (order) => {
        setChosenOrder(order)
        setShowCancelOrderModal(true);
    }

    const handleConfirmPickupClose = () => {
        setShowConfirmPickupModal(false);
    }
    const handleConfirmPickupShow = (order) => {
        setChosenOrder(order)
        setShowConfirmPickupModal(true);
    }

    const handleShowUserProfile = (id) => {
        history.push(`/users/${id}`);
    }

    const cancelOrder = () => {
        handleCancelOrderClose();
        chosenOrder.is_canceled = true;
        api.putUserOrdersHistory(chosenOrder)
            .then((res) => {
                toast.success(`Your order has been canceled!`);
                console.log(res.data);
                getOrders();
            })
            .catch((err) => {
                getOrders();
                toast.error("Could not cancel your order.")
                console.log("Could not cancel your order " + err.message);
            })
    }

    const confirmPickup = () => {
        handleConfirmPickupClose();
        chosenOrder.is_picked = true;
        api.putUserOrdersHistory(chosenOrder)
            .then((res) => {
                toast.success(`Your order pick up has been confirmed!`);
                console.log(res.data);
                getOrders();
            })
            .catch((err) => {
                getOrders();
                toast.error("Could not confirm pick up.")
                console.log("Could not confirm pick up " + err.message);
            })
    }

    return (
        orderHistory.map((order) => {
            return (
                <div key={order.id}>
                    <Card className="flex-row">{
                        order.offer_photo ? <Card.Img className="meal-photo" src={order.photo} /> : <Card.Img className="meal-photo" src={placeholder} />
                    }
                        <Card.Body>
                            <Card.Title className="card-title">{order.offer_name}</Card.Title>
                            <Card.Text>{order.offer_description}</Card.Text>
                            <Card.Text><BucketFill size={15}/>  <strong>Ordered portions: </strong> {order.portions}</Card.Text>
                            <Card.Text className="cancel-confirm-buttons"> {
                                (!order.is_picked && !order.is_canceled) ?
                                    <Button className="order-button" variant="success" onClick={(e) => handleConfirmPickupShow(order)}>Confirm pick up</Button>: null
                                }
                                {
                                    (!order.is_picked && !order.is_canceled) ?
                                        <Button className="cancel-order-button" variant="dark" onClick={(e) => handleCancelOrderShow(order)}>Cancel</Button>: null
                                }
                                {order.is_picked ?
                                    <Card.Text className="picked"><BagCheckFill size={15}/>  <strong className="picked">You have picked up your order! </strong></Card.Text>: null
                                }
                                {order.is_canceled ?
                                    <Card.Text className="canceled"><BagXFill size={15}/>  <strong className="canceled">You have canceled your order! </strong></Card.Text>: null
                                }
                            </Card.Text>
                            <Card.Text className="view-profile-button"> <Button className="view-button" variant="secondary" onClick={(e) => handleShowUserProfile(order.fromUser_id)}>View user profile </Button> {order.fromUser_name}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    <Modal show={showCancelOrderModal} onHide={handleCancelOrderClose} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure you want to cancel your order?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button className="order-button" variant="success" type="submit" onClick={cancelOrder}>
                                Yes
                            </Button>
                            <Button className="cancel-order-button" variant="dark" onClick={handleCancelOrderClose}>
                                No
                            </Button>
                        </Modal.Footer>
                    </Modal>
                    <Modal show={showConfirmPickupModal} onHide={handleConfirmPickupClose} backdrop="static">
                        <Modal.Header closeButton>
                            <Modal.Title>Are you sure you want to confirm pick up?</Modal.Title>
                        </Modal.Header>
                        <Modal.Footer>
                            <Button className="order-button" variant="success" type="submit" onClick={confirmPickup}>
                                Yes
                            </Button>
                            <Button className="cancel-order-button" variant="dark" onClick={handleConfirmPickupClose}>
                                No
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            )
        })
    );
}

export default OrdersHistory;