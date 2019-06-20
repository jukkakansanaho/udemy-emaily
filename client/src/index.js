import 'materialize-css/dist/css/materialize.min.css'; // == import materializeCSS from 'm...';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reduxThunk from 'redux-thunk';

import App from './components/App';
import reducers from './reducers';

// Development-only Axios helpers:
// HOWTO test OAuth2 authenticated backend
// 1) Import axios to client side to (temporarily) test OAuth2 authenticated backend.
// Testing otherwise very compolicated with e.g. Postman.
// 2) Go to client page
// 3) open console
// 4) Write 'axios' on command line
// 5) Write e.g. axios.post for POST method
// => This way you can authenticate with the client web site as normally and
// access/use all the cookies in your test requests.
// NOTE! See examplecode.js for command line code.
import axios from 'axios';
window.axios = axios;

// createStore args: reducer, initial state of App, any middleware
const store = createStore(reducers, {}, applyMiddleware(reduxThunk));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.querySelector('#root')
);
