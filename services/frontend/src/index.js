import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from 'react-router-dom';

import App from './App.jsx';

import { createBrowserHistory } from 'history';
export const history = createBrowserHistory();

ReactDOM.render(
  (
    <Router history={history}>
      <meta name='viewport' content='width=device-width, initial-scale=1.0' />
      <App />
    </Router>
  ),
  document.getElementById('root')
);
