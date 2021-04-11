import React, {useEffect, useState} from 'react';
import {Button, Form, Row, Col} from "react-bootstrap";
import "./LoginRegisterForm.css";
import PropTypes from "prop-types";
import {Link, Redirect} from "react-router-dom";

function LoginForm(props) {

  const [ form, setForm ] = useState({})
  const [ errors, setErrors ] = useState({})

  if (props.isAuthenticated()) {
    return <Redirect to="/" />;
  }

  const setField = (field, value) => {
    setForm({
      ...form,
      [field]: value
    })
    if ( !!errors[field] ) setErrors({
      ...errors,
      [field]: null
    })
  }

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = findFormErrors();
    if ( Object.keys(newErrors).length > 0 ) {
      setErrors(newErrors);
    } else {
      if(props.handleLoginFormSubmit(form)){

      }
      setForm({});
    }
  }

  const findFormErrors = () => {
    const { email, password } = form
    const newErrors = {}
    if ( !email || email === '' ) newErrors.email = 'Provide e-mail!'
    if ( !password || password === '' ) newErrors.password = 'Provide password!'
    return newErrors;
  }


  return (
      <Form onSubmit={handleSubmit}>
        <div className="login-container">
          <Form.Group controlId="formBasicTitle">
            <div className="login-title">
              <Form.Label>Sign in</Form.Label>
            </div>
            <div className="login-content">
              <Form.Control
                className="login-control" type="email" placeholder="E-mail"
                onChange={e => setField('email', e.target.value)}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type='invalid'>{errors.email}</Form.Control.Feedback>
            </div>
            <div className="login-content">
              <Form.Control
                className="login-control" type="password" placeholder="Password"
                onChange={e => setField('password', e.target.value)}
                isInvalid={!!errors.password}
              />
              <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
            </div>
            <Button className="login-button" type="submit" onClick={handleSubmit} variant="dark">Log in</Button>
            <Row>
              <Col md={6}>
                <h6>Not a member?</h6>
              </Col>
              <Col md={4}>
                <Link className="link" to="/register"> Sign up </Link>
              </Col>
            </Row>
          </Form.Group>
        </div>
      </Form>
  );
}

LoginForm.propTypes = {
  handleLoginFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default LoginForm;