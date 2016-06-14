import { ADD_TO_CART, CHECKOUT } from './timetravel.actions';

const defaultState = {
  cartItems: [],
  isShopping: true,
  isCheckingOut: false,
  completedCheckout: false,
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

const timetravelReducer = (state = defaultState, action) => {
  switch (action.type) {
    case ADD_TO_CART:
      const cart = reduceAddToCart(state, action);
      console.log('CART ITEMS', cart);
      return cart;
    case CHECKOUT:
      return reduceCheckout(state, action);
    default:
      return state;
  }
};

export default timetravelReducer;
