import {
  ADD_TO_CART,
  CHECKOUT,
  RESET,
  START_DEBUG_SESSION,
  STOP_DEBUG_SESSION,
  DEBUG_ACTION,
  LOAD_DEBUG_SESSIONS_RECEIVE,
} from './timetravel.actions';

const defaultState = {
  cartItems: [],
  isShopping: true,
  isCheckingOut: false,
  completedCheckout: false,
  isDebuggingSession: false,
  debugSessions: [],
}

const reduceAddToCart = (state, action) => {
  const cartItems = [...state.cartItems, action.newCartItem];
  return Object.assign({}, state, {
    cartItems,
  });
};

const reduceCheckout = (state, action) => {
  return Object.assign({}, state, {
    isShopping: false,
    isCheckingOut: true,
  });
};

const reduceLoadDebugSession = (state, action) =>
  Object.assign({}, state, {
    debugSessions: action.debugSessions,
  });

const reduceReset = (state, action) => {
  // Før debugging begynner må all state resettes
  return defaultState;
};

const reduceStartDebugSession = (state, action) => {
  // Debugging begynner, setter riktige flagg for å hindre http requests
  return Object.assign({}, state, {
    isDebuggingSession: true,
  });
};

const reduceStopDebugSession = (state, action) => {
  // Debugging slutter, tillat http requests igjen
  return Object.assign({}, state, {
    isDebuggingSession: false,
  });
};

const reduceDebugAction = (state, action) => {
  // Debugging av en action
  console.log('reduceDebugAction', action);
  return state;
};

const timetravelReducer = (state = defaultState, action) => {
  switch (action.type) {
    case LOAD_DEBUG_SESSIONS_RECEIVE:
      return reduceLoadDebugSession(state, action);
    case RESET:
      return reduceReset(state, action);
    case START_DEBUG_SESSION:
      return reduceStartDebugSession(state, action);
    case STOP_DEBUG_SESSION:
      return reduceStopDebugSession(state, action);
    case DEBUG_ACTION:
      return reduceDebugAction(state, action);
    case ADD_TO_CART:
      return reduceAddToCart(state, action);
    case CHECKOUT:
      return reduceCheckout(state, action);
    default:
      return state;
  }
};

export default timetravelReducer;
