import React, { useState } from "react";
import * as yup from "yup";
import "./FormStyles.css";
import { Row, Col } from "react-bootstrap";
import { Redirect, Route } from "react-router-dom";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Form } from "react-bootstrap";
import api from '../api.js';
import DateTimePicker from 'react-datetime-picker';

const text_inputs = [
  {
    name: "name",
    label: "Title",
    type: "text",
  },
  {
    name: "pickup_localization",
    label: "Pickup Localization",
    type: "text",
  },
];

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
    pickup_localization: yup
        .string()
        .required("Localization is required"),
    pickup_times: yup
        .string()
        .required("Pick-up Times are required")
});

const redirectToMainPage= (mealClosed) => {
    mealClosed(true);
}


const handleAddMealSubmit = (data, expireDate, mealAdded) => {
    data['offer_expiry'] = expireDate.toLocaleString()
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
    const [isMealAdded, isMealAddedChange] = useState(false)
    const [isMealClosed, isMealClosedChange] = useState(false)
    
    if (isMealAdded || isMealClosed) {
        return <Redirect to="/" />;
    }

    if (!isLoggedIn) {
        return <Redirect to="/login" />;
    }

    return (
        <div className="form-container form-group">
            <form onSubmit={handleSubmit((data) => handleAddMealSubmit(data, expireDate, isMealAddedChange))}>

            <Form.Label className="login-title">Add meal</Form.Label>

            {text_inputs.map((input, key) => {
                return (
                <Row key={key} className="field-content form-group">
                    <Form.Label className="label-field">{input.label}</Form.Label>
                    <Form.Control size="lg" className="field-control" {...register(input.name)} type={input.type} />
                    {errors[input.name] && (
                    <p className="error login-error">{errors[input.name].message}</p>
                    )}
                </Row>
                );
            })}
            
            <Row className="field-content form-group">
                <Form.Label className="label-field">{portion_input.label}</Form.Label>
                <Form.Control size="lg" className="field-control" {...register(portion_input.name)} type={portion_input.type} defaultValue='1'/>
            </Row>

            <div className="field-content form-group">
                <Form.Label className="label-field">{description.label}</Form.Label>
                <textarea className="textarea-control" {...register(description.name)}>
                </textarea>
            </div>

            <div className="field-content form-group">
                <Form.Label className="label-field">{pickup_times.label}</Form.Label>
                <textarea className="textarea-control" {...register(pickup_times.name)}>
                </textarea>
            </div>

            <div className="field-content form-group" >
                <Form.Label className="label-field">{offer_expiry.label}</Form.Label>
                <DateTimePicker className="datepicker-control"
                    onChange={expireDateChange}
                    value={expireDate}
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