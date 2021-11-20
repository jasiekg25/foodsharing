import React from 'react';
import { useAuth } from './IsLoggedIn';
import { Route, Redirect } from 'react-router';

const PrivateRoutes = ({ children, ...rest }) => {
  const { isLoggedIn } = useAuth();

  return (
    <Route
      {...rest}
      render={({ location }) =>
        isLoggedIn ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: '/login',
            }}
          />
        )
      }
    />
  );
};

export default PrivateRoutes;
