import React from 'react'
import BasicForm from "./BasicForm"
import * as yup from "yup";
import { Row, Col } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

require('yup-password')(yup)

const inputs = [
    {
        name: "firstName",
        label: "First Name",
        type: "text",
    },
    {
        name: "lastName",
        label: "Last Name",
        type: "text",
    },
    {
        name: "email",
        label: "Email",
        type: "email",
    },
    {
        name: "password",
        label: "Password",
        type: "password",
    },
    {
        name: "confirmPassword",
        label: "Confirm Password",
        type: "password",
    },
];

const schema = yup.object().shape({
    firstName: yup.string().required("Field required!"),
    lastName: yup.string().required("Field required!"),
    email: yup
        .string()
        .email("Invalid email!")
        .required("Field required!"),
    password: yup.string().password().required("Field required!"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Does not match with Password!")
        .required("Field required!"),
});

const Register = ({ onSubmit, isLoggedIn }) => {
    const handleSubmit = (data) => {
        const {confirmPassword, ...rest} = data
        return onSubmit(rest);
    }

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }
    return (
        <div className="login-container form-group">
            <BasicForm 
                inputs={inputs} schema={schema} 
                onSubmit={handleSubmit} title="Sign up" />
            <Row>
                <Col md={6}>
                    <h6>Already have an account?</h6>
                </Col>
                <Col md={4}>
                    <Link className="link" to="/login"> Sign in </Link>
                </Col>
            </Row>
        </div>
    )
}

export default Register
