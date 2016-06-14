import createActionCreator from 'utils/createActionCreator.util';

export const ADD_TO_CART = 'ADD_TO_CART';
export const CHECKOUT = 'CHECKOUT';

export const addToCart = createActionCreator(ADD_TO_CART, 'newCartItem');
export const checkout = createActionCreator(CHECKOUT);
