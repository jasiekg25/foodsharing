import React, {useEffect, useState} from 'react';
import {Button, Card, Col, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import photo from "../img/profile.png";
import {CalendarFill, EnvelopeFill, GeoAltFill, TelephoneFill} from "react-bootstrap-icons";
import api from "../api";

function OtherUserProfile(props) {

    const [user, setUser] = useState({});
    const {id} = props.match.params;

    useEffect(() => {
        getUserInfo();
    }, [])

    const getUserInfo = () => {
        api.getOtherUserProfile(id)
            .then((res) => {setUser(res.data);
            })
            .catch((err) => {
                console.log("Could not get user " + err.message);
            })
    }

    return (
        <Row>
            <Col md={3}/>
            <Col md={6}>
                <Card className="profile-card">
                    <Card.Body className="profile-top">
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
                        <ListGroupItem> <CalendarFill size={20}/> <strong> With SC since: </strong> {user.created_date}</ListGroupItem>
                        <Card.Footer/>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    );
}

export default OtherUserProfile;
