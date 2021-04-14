import React from "react";
import * as yup from "yup";
import BasicForm from "./BasicForm";
import "./LoginRegisterForm.css";
import { Row, Col } from "react-bootstrap";
import { Link, Redirect } from "react-router-dom";

const inputs = [
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
];

const schema = yup.object().shape({
  email: yup
    .string()
    .email()
    .required("Field required!"),
  password: yup.string().required("Field required!"),
});

const Login = ({ onSubmit, isLoggedIn }) => {
  if (isLoggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <div className="login-container form-group">
      <BasicForm
        inputs={inputs}
        schema={schema}
        onSubmit={onSubmit}
        title="Log in"
      />

      <Row>
        <Col md={6}>
          <h6>Not a member?</h6>
        </Col>
        <Col md={4}>
          <Link className="link" to="/register">
            {" "}
            Sign up{" "}
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default Login;
