import React, {useEffect, useState} from 'react';
import api from "../api";
import {Button, Card, Form, InputGroup, ListGroup, ListGroupItem, Modal} from "react-bootstrap";
import {AlarmFill, BucketFill, ClockFill, GeoAltFill, Tag, TagFill, TelephoneFill} from "react-bootstrap-icons";
import {toast} from "react-toastify";
import * as yup from "yup";
import {useForm} from "react-hook-form";
import {yupResolver} from "@hookform/resolvers/yup";
import FileUplader from "./fileUplader/FileUplader";
import placeholder from "../img/placeholder.jpg";
import MapPicker from "./maps/MapPicker";
import useMap from "./maps/useMap";
import TagSearch from "./tags/TagSearch";
import DatePicker from "react-date-picker";
import "./OrderHistory.css";


const name = {
    name: "name",
    type: "text",
};

const pickup_times = {
    name: "pickup_times",
    type: "text",
}

const description = {
    name: "description",
    type: "textarea",
};

const portions_number = {
    name: "portions_number",
    type: "number",
};

const offer_expiry = {
    name: "offer_expiry",
    type: "Date",
}

const schema = yup.object().shape({
    name: yup.string(),
    portions_number: yup
        .number()
        .moreThan(0, "Portions number must positive value"),
    description: yup.string(),
    offer_expiry: yup.date(),
});

function UserOffers(props) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [userOffers, setUserOffers] = useState([]);
    const [offer, setChosenOffer] = useState({})
    const [showDeleteOfferModal, setShowDeleteOfferModal] = useState(false);
    const [showEditOfferModal, setShowEditOfferModal] = useState(false);
    const [file, setFile] = useState('');
    const { mapRef, center, setCenter} = useMap({
        lat: 50.06143,
        lng: 19.93658,
    })

    const [expireDate, setExpireDate] = useState(new Date());
    const [tags, setTags] = useState([]);

    const setOfferTags = (offerTags) => {
        offerTags.forEach(tag => {
            const t = tags.find((el) => el.tag_id === tag.tag_id);
            t.selected = !t.selected;
        })
    };

    const onTagToggle = (tag) => {
        const index = tags.findIndex((el) => el.tag_id === tag.tag_id);
        let newTags = [...tags];
        newTags[index] = { ...tag, selected: !tag.selected };

        setTags(newTags);
    };

    useEffect(() => {
        getOffers();
        getTags();
    }, [])

    const getOffers = () => {
        api.getUserCurrentOffers()
            .then((res) => {setUserOffers(res.data);
            })
            .catch((err) => {
                console.log("Could not get current user " + err.message);
            })
    }

    const getTags = () => {
        api.getTags()
            .then((res) => {
                let tagsData = res.data;
                tagsData.map(tag => {
                    tag.selected = false;
                    tag.tag_id = tag.id;
                    delete tag.id;
                });
                setTags(tagsData);
            })
            .catch((err) => {
                console.log("Could not get any tags " + err.message);
            });
    }


    const deleteOffer = () => {
        handleDeleteOfferClose();
        offer.active = false;
        api.putUserCurrentOffers(offer)
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

    const changeOfferInfo = (data) => {
        offer.name = data.name;
        offer.portions_number = data.portions_number;
        offer.description = data.description;
        offer.pickup_longitude = center.lng;
        offer.pickup_latitude = center.lat;
        offer.photo = file;
        expireDate.setHours(23, 59, 59);
        offer.offer_expiry = expireDate.toLocaleString('en-US');
        offer.tags = tags.filter(tag => tag.selected);
        const formData = new FormData()
        formData.append('photo', file);
        formData.append('data', JSON.stringify(offer));
        api.putUserCurrentOffers(formData)
            .then((res) => {
                toast.success(`Your offer info has been updated!`);
                console.log(res.data);
                getOffers();
            })
            .catch((err) => {
                getOffers();
                toast.error("Could not update your offer information.")
                console.log("Could not update your offer info " + err.message);
            })
        handleEditOfferClose();
    }

    const handleDeleteOfferClose = () => {
        setShowDeleteOfferModal(false);
    }
    const handleDeleteOfferShow = (offer) => {
        setChosenOffer(offer)
        setShowDeleteOfferModal(true);
    }

    const handleEditOfferClose = () => {
        setFile("");
        setCenter({
            lat: 50.06143,
            lng: 19.93658,
        });
        setExpireDate(new Date());
        getTags();
        reset({
            name: offer.name,
            description: offer.description,
            pickup_times: offer.pickup_times,
            offer_expiry: new Date(offer.offer_expiry),
            portions_number: offer.portions_number
        });
        setShowEditOfferModal(false);
    }
    const handleEditOfferShow = (offer) => {
        setChosenOffer(offer);
        setFile(offer.photo);
        setCenter({
            lat: offer.pickup_latitude,
            lng: offer.pickup_longitude,
        });
        setExpireDate(new Date(offer.offer_expiry));
        setOfferTags(offer.tags);
        reset({
            name: offer.name,
            description: offer.description,
            pickup_times: offer.pickup_times,
            offer_expiry: new Date(offer.offer_expiry),
            portions_number: offer.portions_number
        });
        setShowEditOfferModal(true);
    }

    return (
        userOffers.map((offer) => {
            return (
                <div key={offer.id}>
                    <Card className="flex-row"> {
                        offer.photo ? <Card.Img className="meal-photo" src={offer.photo} /> : <Card.Img className="meal-photo" src={placeholder} />
                    }
                        <Card.Body>
                            <Card.Title>{offer.name}</Card.Title>
                            <Card.Text>{offer.description}</Card.Text>
                            <ListGroup className="list-group-flush">
                                <ListGroupItem> <BucketFill size={15}/>  <strong>Remaining portions: </strong> {offer.portions_number}</ListGroupItem>
                                <ListGroupItem> <ClockFill size={15}/> <strong> Pick-up times: </strong> {offer.pickup_times}</ListGroupItem>
                                <ListGroupItem> <AlarmFill size={15}/> <strong> Expire date: </strong> {offer.offer_expiry} </ListGroupItem>
                                <ListGroupItem> <TagFill size={15}/> <strong>Tags: </strong> {Array.from(offer.tags).map((tag, index) => {
                                     return (<small key={index}>{tag.tag_name}, </small>);
                                })}
                                </ListGroupItem>
                            </ListGroup>
                            <Card.Text className="cancel-confirm-buttons">
                                <Button className="order-button" variant="success" onClick={(e) => handleEditOfferShow(offer)}>Edit</Button>
                                <Button className="cancel-order-button" variant="dark" onClick={(e) => handleDeleteOfferShow(offer)}>Delete</Button>
                            </Card.Text>
                        </Card.Body>
                        <Modal show={showDeleteOfferModal} onHide={handleDeleteOfferClose} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Are you sure you want to delete your offer?</Modal.Title>
                            </Modal.Header>
                            <Modal.Footer>
                                        <Button className="order-button" variant="success" type="submit" onClick={deleteOffer}>
                                            Delete
                                        </Button>
                                        <Button className="cancel-order-button" variant="dark" onClick={handleDeleteOfferClose}>
                                            Cancel
                                        </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal className="edit-offer-modal" show={showEditOfferModal} onHide={handleEditOfferClose} backdrop="static">
                            <Modal.Header closeButton>
                                <Modal.Title>Edit your offer information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <form onSubmit={handleSubmit(data => {changeOfferInfo(data)})}>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Name</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control defaultValue={offer.name} {...register(name.name)} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Portions number</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control defaultValue={offer.portions_number} {...register(portions_number.name)} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Description</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control as={description.type} defaultValue={offer.description} {...register(description.name)} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Pickup times</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <Form.Control defaultValue={offer.pickup_times} {...register(pickup_times.name)} />
                                    </InputGroup>
                                    <InputGroup>
                                        <InputGroup.Prepend>
                                            <InputGroup.Text>Offer expiry</InputGroup.Text>
                                        </InputGroup.Prepend>
                                        <DatePicker onChange={date => setExpireDate(date)}
                                                    value={expireDate}
                                                    dataFormat = 'MM/dd/yyyy'
                                                    minDate = {new Date()}
                                        />
                                    </InputGroup>
                                    <InputGroup>
                                        <MapPicker mapRef={mapRef} center={center} setCenter={setCenter} className="map-control"/>
                                    </InputGroup>
                                    <InputGroup>
                                        <FileUplader file={file} setFile={setFile} />
                                    </InputGroup>
                                    <div className="field-content form-group">
                                        <TagSearch tags={tags}
                                                   onTagToggle={onTagToggle}
                                        />
                                    </div>
                                    <Modal.Footer>
                                        <Button className="order-button" variant="success" type="submit">
                                            Save
                                        </Button>
                                        <Button className="cancel-order-button" variant="dark" onClick={handleEditOfferClose}>
                                            Cancel
                                        </Button>
                                    </Modal.Footer>
                                </form>
                            </Modal.Body>
                        </Modal>
                    </Card>
                </div>
            )
        })
    );
}

export default UserOffers;
