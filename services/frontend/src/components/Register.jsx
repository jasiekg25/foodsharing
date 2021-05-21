import React, { useState } from "react";
import BasicForm from "./BasicForm";
import * as yup from "yup";
import { Row, Col, Alert, Container, Card } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import "./LoginRegister.css";

require("yup-password")(yup);

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
  password: yup
    .string()
    .password()
    .required("Field required!"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Does not match with Password!")
    .required("Field required!"),
});

const Register = ({ isLoggedIn }) => {
  const [isSubmitted, setSubmitted] = useState(false);

  const onSubmit = (data) => {
    const { confirmPassword, ...rest } = data;
    api
      .register(rest)
      .then((res) => {
        console.log(res.data);
        setSubmitted(true);
        return true;
      })
      .catch((err) => {
        console.log(err);
        toast.error("That user already exists.");
        return false;
      });
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <>
      {isSubmitted ? (
        <Container className="login-container">
          <h4> Thanks for signing up, please confirm your email. </h4>
          <p>
            We've emailed you a confirmation link. Once you confirm your email
            you can continue setting up your profile.
          </p>
          <p>Resend email confirmation</p>
        </Container>
      ) : (
        <div className="login-container form-group">
          <BasicForm
            inputs={inputs}
            schema={schema}
            onSubmit={onSubmit}
            title="Sign up"
          />
          <Row>
            <Col className="member-text" md={6}>
              <h6>Already have an account?</h6>
            </Col>
            <Col className="link" md={4}>
              <Link className="link-text" to="/login">
                {" "}
                Sign in{" "}
              </Link>
            </Col>
          </Row>
        </div>
      )}
    </>
  );
};

export default Register;
