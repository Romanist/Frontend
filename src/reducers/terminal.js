import { SELECT_API_KEY, CANCEL_ORDER, SELECT_MARKET,
  PLACE_ORDER, GET_MY_ORDERS, UPDATE_RATINGS, UPDATE_TICKER, UPDATE_ORDER_BOOK, UPDATE_HISTORY } from '../actions/terminal';
import { ADD_API_KEY, DELETE_API_KEY } from '../actions/apiKeys';
import { getId } from '../generic/random';

export default function(state = {
  selectedApiKey: null,
  selectedMarket: 'USDT-BTC',
  orders: {open: [], completed: []},
  ratings: [],
  ticker: {},
  orderBook: {sell: [], buy: []},
  history: [],
}, action) {
  switch(action.type) {
    case UPDATE_TICKER: {
      if(state.selectedMarket === action.market) {
        return {...state, ticker: action.ticker};
      } else {
        return state;
      }
    }
    case SELECT_API_KEY: {
      return {...state, selectedApiKey: action.key};
    }
    case UPDATE_ORDER_BOOK: {
      if(action.market === state.selectedMarket) {
        const {buy, sell} = action.orderBook;
        action.orderBook.maxBuy = buy.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
        action.orderBook.maxSell = sell.reduce((accum, value) => Math.max(accum, value.Quantity * value.Rate), 0);
        action.orderBook.minBuy = buy.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), action.orderBook.maxBuy);
        action.orderBook.minSell = sell.reduce((accum, value) => Math.min(accum, value.Quantity * value.Rate), action.orderBook.maxSell);
        return {...state, orderBook: action.orderBook};
      } else {
        return state;
      }
    }
    case CANCEL_ORDER: {
      const id = action.order._id;
      const openOrders = state.orders.open.filter(o => o._id !== id);
      const orders = {open: openOrders, completed: state.orders.completed};
      window.localStorage.setItem(`orders${action.order.keyId}`, JSON.stringify(orders));
      return {...state, orders: {open: openOrders, completed: state.orders.completed}};
    }
    case SELECT_MARKET: {
      if(action.market === state.selectedMarket) {
        return state;
      } else {
        return {...state, selectedMarket: action.market, ticker: {}, orderBook: {sell: [], buy: []}, history: []};
      }
    }
    case PLACE_ORDER: {
      const order = action.order;
      order._id = getId();
      const open = state.orders.open;
      const orders = {completed: state.orders.completed, open: [order].concat(open)};
      window.localStorage.setItem(`orders${order.keyId}`, JSON.stringify(orders));
      return {...state, orders };
    }
    case ADD_API_KEY:
      if(!state.selectedApiKey) {
        return {...state, selectedApiKey: action.apiKey};
      } else {
        return state;
      }
    case GET_MY_ORDERS: {
      const {open, completed} = action.orders;
      open.sort((o1, o2) => o2.dt - o1.dt);
      completed.sort((o1, o2) => o2.dt - o1.dt);
      return {...state, orders: {open, completed: completed.filter(o => o.filled > 0)}};
    }
    case DELETE_API_KEY:
      if(state.selectedApiKey && state.selectedApiKey._id === action.apiKey._id) {
        return {...state, selectedApiKey: null};
      } else {
        return state;
      }
    case UPDATE_RATINGS:
      const ratings = action.ratings.filter(r => !!r.name);
      return {...state, ratings: ratings};
    case UPDATE_HISTORY:
      return {...state, history: action.history};
    default:
      return state;
  }
}
