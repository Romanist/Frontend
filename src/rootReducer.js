import apiKeys from './reducers/apiKeys';
import contracts from './reducers/contracts';
import offers from './reducers/offers';
import auth from './reducers/auth';
import exchanges from './reducers/exchanges';
import time from './reducers/time';
import terminal from './reducers/terminal';
import request from './reducers/request';
import rates from './reducers/rates';
import profile from './reducers/profile';
import exchangesInfo from './reducers/exchangesInfo';
import { combineReducers } from 'redux';
import { calculateKeyBalance } from './generic/util';
import generateData from './demoData';

import { LOGGED_OUT } from './actions/auth';

const combined = combineReducers({apiKeys, contracts, offers, auth, exchanges, time, request, terminal, rates, profile, exchangesInfo, selectedNet: (state = 'mainnet') => state});

const root = (state, action) => {
  switch(action.type) {
    case LOGGED_OUT: {
      localStorage.setItem('reduxState', JSON.stringify({auth: {loggedIn: false}}));
      const newState = combined(undefined, action);
      newState.selectedNet = state.selectedNet;
      return newState;
    }
  };
  let newState;
  if(action.rates && !state.rates) {
    newState = generateData(action.rates);
    newState.profile = state ? state.profile : {};
    newState = combined(newState, action);
  } else {
    newState = combined(state, action);
  }
  switch(action.type) {
    case 'UPDATE_EXCHANGE_RATES': {
      const rates = action.rates;
      const current = calculateBalances(newState.contracts.current, newState.apiKeys, rates);
      const incoming = calculateBalances(newState.offers.incoming, newState.apiKeys, rates);
      const outgoing = calculateBalances(newState.offers.outgoing, newState.apiKeys, rates);
      return {...newState, contracts: { ...newState.contracts, current}, offers: {incoming, outgoing}};
    }
    case 'UPDATE_DASHBOARD': {
      newState.contracts.current.forEach(c => {
        c.balance = getItemBalance(c, newState.apiKeys, newState.rates);
      });
      newState.offers.incoming.forEach(c => {
        c.balance = getItemBalance(c, newState.apiKeys, newState.rates);
      });
      newState.offers.outgoing.forEach(c => {
        c.balance = getItemBalance(c, newState.apiKeys, newState.rates);
      });
      const allowed = allowedApiKeys(newState.apiKeys, newState.contracts.current);
      let selectedApiKey;
      if(newState.terminal.selectedApiKey) {
        selectedApiKey = allowed.find(k => k._id === newState.terminal.selectedApiKey._id);
      } else {
        selectedApiKey = allowed[0] || null;
      }
      return {...newState, terminal: {...newState.terminal, selectedApiKey}};
    }
    case 'ON_NET_SELECT':
      let net = newState.selectedNet;
      if(net === 'mainnet') {
        net = 'testnet';
      } else {
        net = 'mainnet';
      }
      localStorage.setItem('selectedNet', net);
      return {...newState, selectedNet: net};
    default:
      return newState;
  }
};
function allowedApiKeys(apiKeys, contracts) {
  const allowedOwnKeys = apiKeys.ownKeys.filter(k => k.state === 'FREE');
  const allowedReceivedKeys = apiKeys.receivedKeys.filter(k => {
    const contract = contracts.find(c => c.keyId === k._id);
    return !!contract;
  });
  return allowedOwnKeys.concat(allowedReceivedKeys);
}

function getItemBalance(item, apiKeys, rates) {
  const key = apiKeys.ownKeys.findById(item.keyId) ||
    apiKeys.receivedKeys.findById(item.keyId);
  if(key) {
    return calculateKeyBalance(key, item.currency, rates);
  } else {
    return null;
  }
}
function calculateBalances(array, apiKeys, rates) {
  return array.map(item => {
    const balance = getItemBalance(item, apiKeys, rates);
    return {...item, balance};
  });
}

Array.prototype.findById = function(id) {
  for(let elem of this) {
    if(elem._id === id) {
      return elem;
    }
  }
};

export default root;
