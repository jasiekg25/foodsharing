import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../api';
import { useAuth } from './IsLoggedIn';

const FinalizeRegistration = () => {
  const { finilize } = useAuth();
  const search = useLocation().search;
  const token = new URLSearchParams(search).get('token');

  useEffect(() => {
    finilize(token);
  }, []);

  return <></>;
};

export default FinalizeRegistration;
