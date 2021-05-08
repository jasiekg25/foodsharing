import React, {useEffect, useState} from 'react';
import api from "../api.js";
import {Col, Card, Row, Button, Form, Modal} from "react-bootstrap";
import "./Offers.css";
import {Redirect} from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";

const portions = {
    name: "portions",
    type: "number",
};

const schema = yup.object().shape({
    portions: yup
        .number()
        .moreThan(0, "Portions number hat to be greater that 0."),
});

function Offers({isLoggedIn}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [offers, setOffers] = useState([]);
    const [chosenOffer, setChosenOffer] = useState({})
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        api.getOffers()
            .then((res) => {
                setOffers(res.data);
            })
            .catch((err) => {
                console.log("Could not get any offers " + err.message);
            })
    }, [])

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    const handleClose = () => {
        reset();
        setShowModal(false);
    }
    const handleShow = (offer) => {
        setChosenOffer(offer);
        setShowModal(true);
    }

    const orderMeal = (data) => {
        handleClose();
        data['offer_id'] = chosenOffer.id;
        api.postOrder(data)
            .then((res) => {
                toast.success(`${chosenOffer.name} order was successful.`);
                console.log(res.data);
            })
            .catch((err) => {
                console.log("Could not order meal " + err)
                toast.error(`Could not order ${chosenOffer.name}`);
            })
    }

    return (
        offers.map((offer) => {
            return (
                <div key={offer.id}>
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
                                        {offer.portions_number - offer.used_portions}
                                    </Card.Text>
                                    <Card.Text>
                                        {offer.user_name}
                                    </Card.Text>
                                        <Button className="order-button" variant="success" onClick={(e) => handleShow(offer)}>Make order</Button>
                                    <Modal className="portions-modal" show={showModal} onHide={handleClose} backdrop="static">
                                        <Modal.Header closeButton>
                                            <Modal.Title>Choose number of portions</Modal.Title>
                                        </Modal.Header>
                                        <Modal.Body>
                                            <form onSubmit={handleSubmit((data) => {orderMeal(data)})}>
                                                <Form.Control min="0" max={chosenOffer.portions_number - chosenOffer.used_portions} defaultValue='0' {...register(portions.name)} type={portions.type}/>
                                                {errors[portions.name] && (
                                                    <p className="error login-error">{errors[portions.name].message}</p>
                                                )}
                                                <Modal.Footer>
                                                    <Button className="order-button" variant="success" type="submit">
                                                        Order
                                                    </Button>
                                                    <Button className="cancel-order-button" variant="dark" onClick={handleClose}>
                                                        Cancel
                                                    </Button>
                                                </Modal.Footer>
                                            </form>
                                        </Modal.Body>
                                    </Modal>
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