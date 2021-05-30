import React, { useState, useEffect } from "react";
import * as yup from "yup";
import "./FormStyles.css";
import { Row, Col } from "react-bootstrap";
import { Redirect, Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form } from "react-bootstrap";
import api from '../api.js';
import DatePicker from "react-date-picker";
import TagSearch from "./tags/TagSearch";
import Map from "./Map";

const name = {
    name: "name",
    label: "Title",
    type: "text",
}

const pickup_localozation = {
    name: "pickup_localization",
    label: "Pickup Localization",
}

const pickup_times = {
    name: "pickup_times",
    label: "Pick-up Times",
    type: "text",
}

const description = {
    name: "description",
    label: "Description",
    type: "textarea",
}

const portion_input = {
        name: "portions_number",
        label: "Portions",
        type: "number",
      };

const offer_expiry = {
    name: "offer_expiry",
    label: "Offer Expire",
    type: "Date",
  }

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Title is required"),
    portions_number: yup
        .number()
        .moreThan(0, "Portions number must positive value"),
    pickup_times: yup
        .string()
        .required("Pick-up Times are required")
});

const redirectToMainPage= (mealClosed) => {
    mealClosed(true);
}

const handleAddMealSubmit = (data, expireDate, mealAdded, tags, coordinates) => {
    expireDate.setHours(23, 59, 59);
    data['offer_expiry'] = expireDate.toLocaleString('en-US');
    data['tags'] = tags.filter(tag => tag.selected).map(tag => tag.id)
    data['latitude'] = coordinates.lat;
    data['longitude'] = coordinates.lng;

    api
      .postOffers(data)
      .then((res) => {
          console.log(res)
        mealAdded(true);
        return true;
      })
      .catch((err) => {
        console.log(err);
        return <Redirect to="/" />;
      });
  };

const AddMeal = ({isLoggedIn}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [expireDate, expireDateChange] = useState(new Date());
    const [isMealAdded, isMealAddedChange] = useState(false);
    const [isMealClosed, isMealClosedChange] = useState(false);
    const [tags, setTags] = useState([]);
    const [coordinates, setCoordinates] = useState({
        lat: 50.06143,
        lng: 19.93658,
      });

    const onTagToggle = (tag) => {
        const index = tags.findIndex((el) => el.id === tag.id);
        let newTags = [...tags];
        newTags[index] = { ...tag, selected: !tag.selected };
    
        setTags(newTags);
      };

    useEffect(() => {
        api.getTags()
            .then((res) => {
                let tagsData = res.data;
                for(let tag of tagsData){
                    tag['selected'] = false;
                }
                setTags(tagsData);
            })
            .catch((err) => {
                console.log("Could not get any tags " + err.message);
            })
    }, [])
    
    if (isMealAdded || isMealClosed) {
        return <Redirect to="/" />;
    }

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="form-container form-group">
            <form onSubmit={handleSubmit((data) => handleAddMealSubmit(data, expireDate, isMealAddedChange, tags, coordinates))}>

            <Form.Label className="login-title">Add meal</Form.Label>

            <Row className="field-content form-group">
                <Form.Label className="label-field">{name.label}</Form.Label>
                <Form.Control size="lg" className="field-control" {...register(name.name)} type={name.type} />
                {errors[name.name] && (
                <p className="error login-error">{errors[name.name].message}</p>
                )}
            </Row>
            
            <Row className="field-content form-group">
                <Form.Label className="label-field">{portion_input.label}</Form.Label>
                <Form.Control size="lg" className="field-control" {...register(portion_input.name)} type={portion_input.type} defaultValue='1'/>
            </Row>

            <div className="field-content form-group">
                <Form.Label className="label-field">{description.label}</Form.Label>
                <Form.Text as={description.type} className="textarea-control" {...register(description.name)}>
                </Form.Text>
            </div>

            <Row className="field-content form-group">
                <Map center={coordinates} setCenter={setCoordinates} className="map-control"/>
            </Row>

            <div className="field-content form-group">
                <Form.Label className="label-field">{pickup_times.label}</Form.Label>
                <textarea className="textarea-control" {...register(pickup_times.name)}>
                </textarea>
            </div>

            <div className="field-content form-group" >
                <Form.Label className="label-field">{offer_expiry.label}</Form.Label>
                <DatePicker className="datepicker-control"
                    onChange={date => expireDateChange(date)}
                    value={expireDate}
                    dataFormat = 'MM/dd/yyyy'
                    minDate = {new Date()}
                />
             </div>

            <div className="field-content form-group">
                <TagSearch className="col-3"
                    tags={tags}
                    onTagToggle={onTagToggle}
                    containerStyle="search-container"
                />
            </div>


            <Row>
                <Col>
                    <Button size="lg" className="submit-button" type="submit" variant="secondary">
                        Submit
                    </Button>
                </Col>
                <Col>
                    <Button size="lg" className="cancel-button" type="button" onClick={() => redirectToMainPage(isMealClosedChange)} variant="dark">
                        Cancel
                    </Button>
                </Col>
            </Row>


            </form>
        </div>
    );
};

export default AddMeal;