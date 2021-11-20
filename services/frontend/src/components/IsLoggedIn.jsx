import React, { createContext, useState, useEffect, useContext } from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Box from '@material-ui/core/Box';
import { toast } from '../utils/toastWrapper';
import api from '../api';
import { useHistory } from 'react-router';

export const AuthContext = createContext({});

const IsLoggedIn = ({ children }) => {
  const history = useHistory();
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setLoggedIn] = useState(false);

  const finilize = async (token) => {
    localStorage.setItem('accessToken', token);
    const res = await api.finalizeRegistration();
    localStorage.setItem('accessToken', res.data.access_token);
    setLoggedIn(true);
    history.push('/offers');
  }

  const timeout = () => {
    localStorage.removeItem("accessToken");
    console.log("Elapsed token removed!");
    toast.error("Session elapsed. You need to log in again")
    setLoggedIn(false);
    history.push("/login");
  };

  const logOut = () => {
    window.localStorage.removeItem('accessToken');
    setLoggedIn(false);
    toast.success('You have logged out.');
  };

  const logIn = (data) => {
    api
      .login(data)
      .then((res) => {
        window.localStorage.setItem('accessToken', res.data.access_token);
        toast.success('You have logged in successfully.');
        setLoggedIn(true);
        history.push('/offers')
      })
      .catch((err) => {
        console.log(err);
        toast.error('Incorrect email and/or password.');
      });
  };

  const checkLoginStatus = () => {
    const token = localStorage.getItem('accessToken');
    setLoggedIn(token ? true : false);
    setLoading(false);
  };

  useEffect(() => {
    checkLoginStatus();
    api.refreshToken();
  }, []);

  return loading ? (
    <Box
      display='flex'
      justifyContent='center'
      alignItems='center'
      minHeight='75vh'
    >
      <CircularProgress size={100} />
    </Box>
  ) : (
    <AuthContext.Provider
      value={{ loading, isLoggedIn, logIn, logOut, timeout, finilize }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default IsLoggedIn;
