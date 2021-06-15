import React, {useEffect, useState} from 'react';
import api from "../api";
import {Redirect} from "react-router-dom";
import photo from "../img/profile.png";
import {Row, Card, Col, ListGroup, ListGroupItem, Button, Modal, Form, InputGroup} from "react-bootstrap";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import {string} from "yup";
import {toast} from "react-toastify";
import "./Profile.css";
import {EnvelopeFill, GeoAltFill, PinMapFill, TelephoneFill} from "react-bootstrap-icons";
import OrdersHistory from "./OrdersHistory";
import UserOffers from "./UserOffers";
import FileUplader from "./fileUplader/FileUplader";

const name = {
    name: "name",
    type: "text",
};

const surname = {
    name: "surname",
    type: "test",
};

const description = {
    name: "description",
    type: "textarea",
};

const phone = {
    name: "phone",
    type: "text",
}

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/

const schema = yup.object().shape({
    name: yup.string(),
    surname: yup.string(),
    description: yup.string(),
    phone: yup
        .string()
        .matches(phoneRegExp, "Phone number is invalid!")
        .min(11, "Phone number must be 9 numbers long.")
        .max(11, "Phone number must be 9 numbers long.")
});


function Profile({isLoggedIn, logoutUser}) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [user, setUser] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [showOrdersHistory, setShowOrdersHistory] = useState(true);
    const [file, setFile] = useState('');
    let orderOffersPanel = showOrdersHistory ? <OrdersHistory/> : <UserOffers/>;

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = () => {
        api.getProfile()
            .then((res) => {setUser(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    const handleClose = () => {
        setShowModal(false);
    }
    const handleShow = () => {
        setShowModal(true);
    }

    let handleShowOrdersHistory = () => {
        setShowOrdersHistory(true)
    }

    let handleShowUserOffers = () => {
        setShowOrdersHistory(false)
    }

    const changeProfileInfo = (data) => {
        handleClose();
        user.name = data.name;
        user.surname = data.surname;
        user.profile_description = data.description;
        user.phone = data.phone;
        const formData = new FormData()
        formData.append('photo', file);
        formData.append('data', JSON.stringify(user));
        api.putProfile(formData)
            .then((res) => {
                toast.success(`Your profile has been updated!`);
                console.log(res.data);
                getUserInfo();
            })
            .catch((err) => {
                getUserInfo();
                toast.error("Could not update your profile information.")
                console.log("Could not update your profile " + err.message);
            })
    }

    return (
        <div>
            <Row>
                <Col md={5}>
                    <Card className="profile-card">
                        <Card.Body className="profile-top">
                            <Button className="edit-button" variant="light" onClick={(e) => handleShow()}>Edit</Button>
                            {user.profile_picture ? <Card.Img className="profile-photo" variant="top" src={user.profile_picture}/> : <Card.Img className="profile-photo" variant="top" src={photo} />}
                        </Card.Body>
                        <Card.Body>
                            <Card.Title className="card-title">{user.name} {user.surname}</Card.Title>
                            <Card.Text>
                                {user.profile_description}
                            </Card.Text>
                        </Card.Body>
                        <ListGroup className="list-group-flush">
                            <ListGroupItem> <EnvelopeFill size={20}/> {user.email}</ListGroupItem>
                            <ListGroupItem> <TelephoneFill size={20}/> {user.phone}</ListGroupItem>
                        </ListGroup>
                        <Card.Body>
                            <Button className="cancel-order-button" variant="dark" onClick={logoutUser}>Log out</Button>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={7}>
                    <div className="orders-offers-buttons">
                        <Button className="orders-offers-button" variant="light" onClick={(e) => handleShowOrdersHistory()}>Orders history</Button>
                        <Button className="orders-offers-button" variant="light" onClick={(e) => handleShowUserOffers()}>Your offers</Button>
                    </div>
                    <hr className="divider"/>
                    <div className="orders-offers hide-scroll">
                        {orderOffersPanel}
                    </div>
                </Col>
            </Row>
            <Modal className="portions-modal" show={showModal} onHide={handleClose} backdrop="static">
                <Modal.Header closeButton>
                    <Modal.Title>Edit your profile information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form onSubmit={handleSubmit(data => {changeProfileInfo(data)})}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Name</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control defaultValue={user.name} {...register(name.name)} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Surname</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control defaultValue={user.surname} {...register(surname.name)} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text>Description</InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control as={description.type} defaultValue={user.profile_description} {...register(description.name)} />
                        </InputGroup>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text><TelephoneFill /></InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control defaultValue={user.phone} {...register(phone.name)} />
                            {errors[phone.name] && (
                                <p className="error login-error">{errors[phone.name].message}</p>
                            )}
                        </InputGroup>
                        <InputGroup>
                            <FileUplader file={user.profile_picture} setFile={setFile} />
                        </InputGroup>
                        <Modal.Footer>
                            <Button className="order-button" variant="success" type="submit">
                                Save
                            </Button>
                            <Button className="cancel-order-button" variant="dark" onClick={handleClose}>
                                Cancel
                            </Button>
                        </Modal.Footer>
                    </form>
                </Modal.Body>
            </Modal>
        </div>
    );
}

export default Profile;