import React, { useEffect } from 'react';
import { useAuth } from './IsLoggedIn';

const TimeOut = () => {
  const { timeout } = useAuth();

  useEffect(() => {
    timeout();
  }, []);

  return <></>;
};

export default TimeOut;
