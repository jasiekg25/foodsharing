import React, { useState } from "react";
import * as yup from "yup";
import { Link, Redirect } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../api";
import "./LoginRegister.css";

import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import Grid from "@material-ui/core/Grid";
import Box from "@material-ui/core/Box";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
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

const passwordTip = (
  <p style={{ margin: 0 }}>
    Password must be at least 8 characters long, <br />
    contain at least: 1 uppercase letter, 1 number and 1 symbol
  </p>
);

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

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = ({ isLoggedIn }) => {
  const classes = useStyles();
  const [isSubmitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

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

  if (isSubmitted) {
    return (
      <Box className={classes.paper}>
        <Card style={{ width: 350, font: 14 }}>
          <CardContent>
            <Typography variant="h5">
              Thanks for signing up, please confirm your email.
            </Typography>
            <Typography >
              We've emailed you a confirmation link. Once you confirm your email
              you can continue setting up your profile.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form
          className={classes.form}
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                autoFocus
                {...register("firstName")}
                error={!!errors.firstName}
                helperText={errors?.firstName?.message}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                {...register("lastName")}
                error={!!errors.lastName}
                helperText={errors?.lastName?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                {...register("email")}
                error={!!errors.email}
                helperText={errors?.email?.message}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                {...register("password")}
                error={!!errors.password}
                helperText={errors?.password?.message || passwordTip}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                id="confirmPassword"
                autoComplete="current-password"
                {...register("confirmPassword")}
                error={!!errors.confirmPassword}
                helperText={errors?.confirmPassword?.message}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default Register;
