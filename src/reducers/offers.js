import { ACCEPT_OFFER, REJECT_OFFER, CANCEL_OFFER, SEND_OFFER } from '../actions/offers';
import { UPDATE_DASHBOARD } from '../actions/dashboard';
import { combineReducers } from 'redux';

function incoming(state = [], action) {
  switch(action.type) {
    case REJECT_OFFER:
      return state.filter(o => o._id !== action.offer._id);
    case ACCEPT_OFFER:
      return state.map(o => o._id === action.offer._id ? {...o, state: 'ACCEPTED'} : o);
    default:
      return state;
  }
}

function outgoing(state = [], action) {
  switch(action.type) {
    case CANCEL_OFFER:
      return state.filter(offer => offer._id !== action.offer._id);
    case SEND_OFFER:
      return state.concat(action.offer);
    default:
      return state;
  }
}

export default combineReducers({outgoing, incoming});
