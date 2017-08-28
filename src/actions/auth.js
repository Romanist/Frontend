import { apiPost } from '../generic/apiCall';

export const LOGGED_OUT = 'LOGGED_OUT';
export const LOGGED_IN = 'LOGGED_IN';
export const NAME_REQUIRED = 'NAME_REQUIRED';
export const SET_NICKNAME = 'SET_NICKNAME';

export function logIn() {
  return dispatch => {
    window.web3.eth.getAccounts((err, accounts) => {
      const acc = accounts[0];
      if(!acc) {
        alert('no active acc11');
        return;
      }
      const message = window.web3.sha3('MercatusLogin');
      window.web3.eth.sign(acc, message, (err, result) => {
        if(!err) {
          window.fetch('/api/auth', {
            credentials: 'same-origin',
            method: 'post',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({sgn: result, addr: acc})
          }).then(res => res.json())
            .then(json => {
              if(json.isNew) {
                dispatch(nameRequiredAction());
              } else {
                dispatch(loggedInAction(json));
              }
            })
            .catch(err => console.log(err));
        }
      });
    });
  };
}

export function addName(name) {
  return dispatch => {
    apiPost('/api/addName', {
      body: JSON.stringify({name})
    }, dispatch)
      .then(({ result }) => {
        if(result) {
          dispatch(setNicknameAction(name));
        }
      });
  };
}

export function setNicknameAction(name) {
  return {
    type: SET_NICKNAME,
    name
  };
}

function nameRequiredAction() {
  return {
    type: NAME_REQUIRED
  };
}

function loggedInAction(data) {
  return {
    type: LOGGED_IN,
    data
  };
}


