import React from "react";
import PropTypes from "prop-types";
import { Formik } from "formik";
import * as Yup from "yup";
import { Redirect } from "react-router-dom";

const LoginForm = props => {
  if (props.isAuthenticated()) {
    return <Redirect to="/" />;
  }
  return (
    <section className="hero is-halfheight">
      <div className="hero-body">
        <div className="container">
          <h1 className="title has-text-centered">Welcome, I am Fred :)</h1>

          <div className="columns is-mobile is-centered">
            <div className="column is-one-third is-mobile is-centered">
              <Formik
                initialValues={{
                  email: "",
                  password: ""
                }}
                onSubmit={(values, { setSubmitting, resetForm }) => {
                  props.handleLoginFormSubmit(values);
                  resetForm();
                  setSubmitting(false);
                }}
                validationSchema={Yup.object().shape({
                  email: Yup.string()
                    .email("Enter a valid email.")
                    .required("Email is required."),
                  password: Yup.string().required("Password is required.")
                })}
              >
                {props => {
                  const {
                    values,
                    touched,
                    errors,
                    isSubmitting,
                    handleChange,
                    handleBlur,
                    handleSubmit
                  } = props;
                  return (
                    <form onSubmit={handleSubmit}>
                      <div className="field">
                        <label className="label" htmlFor="input-email">
                          Email
                        </label>
                        <input
                          name="email"
                          id="input-email"
                          className={
                            errors.email && touched.email
                              ? "input error"
                              : "input"
                          }
                          type="email"
                          placeholder="Enter an email address"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.email && touched.email && (
                          <div className="input-feedback">{errors.email}</div>
                        )}
                      </div>
                      <div className="field">
                        <label className="label" htmlFor="input-password">
                          Password
                        </label>
                        <input
                          name="password"
                          id="input-password"
                          className={
                            errors.password && touched.password
                              ? "input error"
                              : "input"
                          }
                          type="password"
                          placeholder="Enter a password"
                          value={values.password}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.password && touched.password && (
                          <div className="input-feedback">
                            {errors.password}
                          </div>
                        )}
                      </div>
                      <input
                        type="submit"
                        className="button is-fullwidth secondary-btn is-rounded raised"
                        value="Log in"
                        disabled={isSubmitting}
                      />
                    </form>
                  );
                }}
              </Formik>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

LoginForm.propTypes = {
  handleLoginFormSubmit: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.func.isRequired
};

export default LoginForm;
