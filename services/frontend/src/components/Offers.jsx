import React, {useEffect, useState} from 'react';
import api from "../api.js";
import {Col, Card, Row, Button, Form, Modal, ListGroupItem, ListGroup} from "react-bootstrap";
import "./Offers.css";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {AlarmFill, BucketFill, ClockFill, DistributeHorizontal, GeoAltFill, TagFill} from "react-bootstrap-icons";
import { history } from "../index";
import placeholder from "../img/placeholder.jpg";
import InfiniteScroll from 'react-infinite-scroll-component';

const portions = {
    name: "portions",
    type: "number",
};

const schema = yup.object().shape({
    portions: yup
        .number()
        .moreThan(0, "Portions number has to be greater than 0."),
});

function Offers({offers, getOffers, onOfferSelect}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [chosenOffer, setChosenOffer] = useState({})
    const [offers, setOffers] = useState([]);
    const [chosenOffer, setChosenOffer] = useState({});
    const [showModal, setShowModal] = useState(false);
    let [pageCount, setCount] = React.useState(0);
    let [isNext, isNextFunc] = React.useState(false);
    useEffect(() => {
        getOffers();
    }, [])

    const getOffers = () => {
        api.getOffers() //TODO send page, etc
            .then((res) => {
                setOffers(offers.concat(res.data));
            })
            .catch((err) => {
                console.log("Could not get any offers " + err.message);
            })
    }

    const handleClose = () => {
        reset();
        setShowModal(false);
    }
    const handleShow = (offer) => {
        setChosenOffer(offer);
        setShowModal(true);
    }

    const handleShowUserProfile = (id) => {
        history.push(`/users/${id}`);
    }

    const orderMeal = (data) => {
        handleClose();
        data['offer_id'] = chosenOffer.id;
        api.postOrder(data)
            .then((res) => {
                getOffers();
                toast.success(`${chosenOffer.name} order was successful.`);
                console.log(res.data);
            })
            .catch((err) => {
                console.log("Could not order meal " + err)
                toast.error(`Could not order ${chosenOffer.name}`);
            })
    }

    return (
        <div>
            <InfiniteScroll
                dataLength={offers.length} //This is important field to render the next data
                next={getOffers}
                hasMore={true}
                height='1000px'
                loader={<h4>Loading...</h4>}
                >
                <div>
                    {        offers.map((offer) => {
            return (
                <div key={offer.id} onClick={() => {
                    onOfferSelect(offer)}}>
                    <Row className="offers-container">
                            <Card className="offer-card flex-row">
                                {
                                    offer.photo !== "null" ? <Card.Img className="meal-photo" src={offer.photo} /> : <Card.Img className="meal-photo" src={placeholder} />
                                }
                                <Card.Body>
                                    <Card.Title>{offer.name}</Card.Title>
                                    <Card.Text>
                                        {offer.description}
                                    </Card.Text>
                                    <ListGroup className="list-group-flush">
                                        <ListGroupItem> <ClockFill size={15}/> <strong> Pick-up times: </strong> {offer.pickup_times}</ListGroupItem>
                                        <ListGroupItem> <AlarmFill size={15}/> <strong> Expire date: </strong> {offer.offer_expiry}</ListGroupItem>
                                        <ListGroupItem> <BucketFill size={15}/>  <strong>Remaining portions: </strong> {offer.portions_number - offer.used_portions} </ListGroupItem>
                                        <ListGroupItem> <TagFill size={15}/> <strong>Tags: </strong> {Array.from(offer.tags).map((tag, index) => {
                                            return (<small key={index}>{tag}, </small>);
                                        })}
                                        </ListGroupItem>
                                    </ListGroup>
                                    <div>
                                        <Card.Text className="view-profile-button"> <Button className="view-button" variant="secondary" onClick={(e) => handleShowUserProfile(offer.user_id)}>View user profile </Button> {offer.user_name}</Card.Text>
                                        <Button className="order-button" variant="success" onClick={(e) => handleShow(offer)}>Make order</Button>
                                    </div>
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
                    </Row>
                </div>
            )
        })}
                </div>
            </InfiniteScroll>
        </div>
    )
}

export default Offers;