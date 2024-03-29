import { FETCH_USER } from '../actions/types';

export default function(state = null, action) {
  //console.log(action);
  switch (action.type) {
    case FETCH_USER:
      // Return "user model data" (if data != "") or "false" (if data == "" == empty string)
      return action.payload || false;
    default:
      return state;
  }
}
