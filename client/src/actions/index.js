import axios from 'axios';
import { FETCH_USER, FETCH_SURVEYS } from './types';
// ** fetchUser Action Creator ********************
// NOTE: Original ROUND-1 code:
// export const fetchUser = () => {
//   return function(dispatch) {
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({ type: FETCH_USER, payload: res }));
//   };
// };

// NOTE: ROUND-2 Re-factored code:
// ROUND-2: Re-factoring STEP 1:
// export const fetchUser = () =>
//   function(dispatch) {
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({ type: FETCH_USER, payload: res }));
//   };

// ROUND-2: Re-factoring STEP 2:
// export const fetchUser = () =>
//   (dispatch) => {
//     axios
//       .get('/api/current_user')
//       .then(res => dispatch({ type: FETCH_USER, payload: res }));
//   };
// ROUND-2: Re-factoring STEP 3:
// export const fetchUser = () => dispatch => {
//   axios
//     .get('/api/current_user')
//     .then(res => dispatch({ type: FETCH_USER, payload: res }));
// };
// ROUND-2: Re-factoring STEP 4:
export const fetchUser = () => async dispatch => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

// ROUND-2: Re-factoring STEP 5 (HC OPTIONAL STEP):
// export const fetchUser = () => async dispatch => {
//   dispatch({ type: FETCH_USER, payload: await axios.get('/api/current_user') });
// };
// ROUND-2: Re-factoring STEP 6 (HC OPTIONAL STEP):
// export const fetchUser = () => async dispatch =>
//   dispatch({ type: FETCH_USER, payload: await axios.get('/api/current_user') });
// ** End Of fetchUser Action Creator ********************
// *******************************************************
// ** handleToken Action Creator *************************
export const handleToken = token => async dispatch => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};
// ** End of fetchUser Action Creator ********************
// ** Beginning of submitSurvey Action Creator ********************
export const submitSurvey = (values, history) => async dispatch => {
  const res = await axios.post('/api/surveys', values);
  // NOTE: Use history object to re-direct user to /surveys == Dashboard
  history.push('/surveys');
  dispatch({ type: FETCH_USER, payload: res.data });
};
// ** End of submitSurvey Action Creator ********************

// ** Beginning of fetchSurveys Action Creator ********************
export const fetchSurveys = () => async dispatch => {
  const res = await axios.get('/api/surveys');
  dispatch({ type: FETCH_SURVEYS, payload: res.data });
};
// ** End of fetchSurveys Action Creator ********************
