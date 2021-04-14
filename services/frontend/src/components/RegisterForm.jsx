import React, {useEffect, useState} from 'react';
import {Button, Form, Row, Col} from "react-bootstrap";
import "./LoginRegisterForm.css";
import PropTypes from "prop-types";
import {Link, Redirect} from "react-router-dom";

function RegisterForm(props) {

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
      if(props.handleRegisterFormSubmit(form)){

      }
      setForm({});
    }
  }

  const findFormErrors = () => {
    const { username, email, password } = form
    const newErrors = {}
    if ( !username || username === '' ) newErrors.username = 'Provide username!'
    if ( !email || email === '' ) newErrors.email = 'Provide e-mail!'
    if ( !password || password === '' ) newErrors.password = 'Provide password!'
    return newErrors;
  }


  return (
      <Form onSubmit={handleSubmit}>
        <div className="login-container">
          <Form.Group controlId="formBasicTitle">
            <div className="login-title">
              <Form.Label>Sign up</Form.Label>
            </div>
            <div className="login-content">
              <Form.Control
                className="login-control" type="text" placeholder="Username"
                onChange={e => setField('username', e.target.value)}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type='invalid'>{errors.username}</Form.Control.Feedback>
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
            <Button className="login-button" type="submit" onClick={handleSubmit} variant="dark">Sign up</Button>
            <Row>
              <Col className="member-text" md={6}>
                <h6>Already have an account?</h6>
              </Col>
              <Col className="link-text" md={4}>
                <Link className="link" to="/login"> Sign in </Link>
              </Col>
            </Row>
          </Form.Group>
        </div>
      </Form>
  );
}

RegisterForm.propTypes = {
  handleRegisterFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default RegisterForm;