import React, {useEffect, useState} from 'react';
import api from "../api";
import {Button, Card, Form, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import {AlarmFill, BucketFill, ClockFill, GeoAltFill, Tag, TagFill} from "react-bootstrap-icons";
import {toast} from "react-toastify";

function UserOffers(props) {
    const [userOffers, setUserOffers] = useState([]);
    const [chosenOffer, setChosenOffer] = useState({})
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        getOffers();
    }, [])

    const getOffers = () => {
        api.getUserCurrentOffers()
            .then((res) => {setUserOffers(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }

    const deleteOffer = () => {
        handleClose();
        chosenOffer.active = false;
        api.putUserCurrentOffers(chosenOffer)
            .then((res) => {
                toast.success(`Your offer has been deleted!`);
                console.log(res.data);
                getOffers();
            })
            .catch((err) => {
                getOffers();
                toast.error("Could not delete your offer.")
                console.log("Could not delete your offer " + err.message);
            })
    }

    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = (offer) => {
        setChosenOffer(offer)
        setShowModal(true);
    }

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
                                     return (<small key={index}>{tag.tag_name}, </small>);
                                })}
                                </ListGroupItem>
                            </ListGroup>
                            <Card.Text className="cancel-confirm-buttons">
                                <Button className="order-button" variant="success">Edit</Button>
                                <Button className="cancel-order-button" variant="dark" onClick={(e) => handleShow(offer)}>Delete</Button>
                            </Card.Text>
                        </Card.Body>
                        <Modal show={showModal} onHide={handleClose} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Are you sure you want to delete your offer?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                        <Button className="order-button" variant="success" type="submit" onClick={deleteOffer}>
                                            Delete
                                        </Button>
                                        <Button className="cancel-order-button" variant="dark" onClick={handleClose}>
                                            Cancel
                                        </Button>
                            </Modal.Footer>
                        </Modal>
                    </Card>
                </div>
            )
        })
    );
}

export default UserOffers;
