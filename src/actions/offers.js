import { apiPost, apiDelete, ApiError } from '../generic/apiCall';
import defaultErrorHandler from '../generic/defaultErrorHandler';
import { ABI, ADDRESS, MAIN_NET_ADDRESS } from '../eth/MercatusFactory';
import { getId } from '../generic/random';

export const ACCEPT_OFFER = 'ACCEPT_OFFER';
export const REJECT_OFFER = 'REJECT_OFFER';
export const CANCEL_OFFER = 'CANCEL_OFFER';
export const SEND_OFFER = 'SEND_OFFER';
export const PAY_OFFER = 'PAY_OFFER';


export function acceptOffer(offer) {
  return dispatch => {
    apiPost(`/api/offer/${offer._id}/accept`)
      .then(() => {
        dispatch({
          type: ACCEPT_OFFER,
          offer
        });
      });
  };
}

export function cancelOffer(offer) {
  return dispatch => {
    apiDelete(`/api/offer/${offer._id}`)
      .then(() => {
        dispatch({
          type: CANCEL_OFFER,
          offer
        });
      });
  };
}

export function rejectOffer(offer) {
  return dispatch => {
    apiPost(`/api/offer/${offer._id}/reject`)
      .then(() => {
        dispatch({
          type: REJECT_OFFER,
          offer
        });
      });
  };
}

export function sendOffer(offer) {
  return dispatch => {
    apiPost('/api/offer', null, offer)
      .then(json => {
        offer._id = getId();
        offer.state = 'INIT';
        dispatch({
          type: SEND_OFFER,
          offer,
        });
      })
      .catch(err => {
        if(err.apiErrorCode) {
          switch(err.apiErrorCode) {
            case ApiError.WRONG_MIN_AMOUNT: {
              alert('Your api key balance is lower that trader\'s minmum contract amount');
              break;
            }
            case ApiError.WRONG_DEAL_TERMS:
              alert('Trader has changed contract settings, please reload page');
              break;
            default:
              defaultErrorHandler(err, dispatch);
          }
        }
        console.log(err);
        console.log(err.apiErrorCode);
      });
  };
}

function getSelectedNet() {
  return window.localStorage.getItem('selectedNet') || 'mainnet';
}

export function payOffer(offer) {
  return dispatch => {
    dispatch({
      type: PAY_OFFER,
      offer: offer,
    });
  };
}

function sendTransaction(address, offer, selectedNet) {
  const contract = window.web3.eth.contract(ABI).at(address);
  const { duration, maxLoss, startBalance, targetBalance, amount, _id } = offer;
  const investor = offer.fromUser[0].name;
  const investorAddress = offer.fromUser[0].addr;
  const trader = offer.toUser[0].name;
  const traderAddress = offer.toUser[0].addr;
  let currency;
  switch(offer.currency) {
    case 'ETH':
      currency = 2;
      break;
    case 'BTC':
      currency = 1;
      break;
    case 'USDT':
      currency = 0;
      break;
    default:
      alert(offer.currency + ' not supported for contract yet');
      return;
  }
  contract.makeDeal(
    duration,
    maxLoss,
    startBalance,
    targetBalance,
    amount,
    investor,
    investorAddress,
    trader,
    traderAddress,
    '0x' + _id,
    currency,{value: amount},  (err, tx) => {
      if(err) {
        return;
      } else {
        let txUrl;
        switch(selectedNet) {
          case 'mainnet':
            txUrl = 'https://etherscan.io/tx/' + tx;
            break;
          case 'testnet':
            txUrl = 'https://ropsten.etherscan.io/tx/' + tx;
            break;
          default:
            throw new Error(`unkown selected net: ${selectedNet}`);
        }
        alert('You have sent transaction to pay this request.' +
          ' If transaction completes succesfully you will receive the contract.' +
          ' Check the transaction status in metamask or here: ' +
          txUrl + '\nDo not pay this request again, if the transaction has not completed yet');
      }
    });
}
