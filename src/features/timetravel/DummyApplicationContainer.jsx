import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import DummyButton from './DummyButton';
import { addToCart, checkout } from './timetravel.actions';
import guid from '../../utils/guid.util';
import timetravelDispatcher from './timetravelDispatcher';
import TimetravelContainer from './TimetravelContainer';

const addRandomItemToCart = (onAddToCart) => {
  const items = [
    { id: `1-${guid()}`, name: 'apple' },
    { id: `2-${guid()}`, name: 'banana'},
    { id: `3-${guid()}`, name: 'orange' }
  ];
  const min = 0;
  const max = items.length - 1;
  const randomIndex = Math.floor(Math.random() * (max - min + 1)) + min;
  const randomItem = items[randomIndex];
  onAddToCart(randomItem);
};

const DummyApplicationContainer = ({ onAddToCart, onCheckout, cartItems }) => (
  <div>
    <h1>Ukomplett.no</h1>
      <TimetravelContainer />
      <DummyButton
        text="Add to cart"
        onClick={() => addRandomItemToCart(onAddToCart)}
      />
      <DummyButton
        text="Checkout"
        onClick={onCheckout}
      />
    <ul>
      {cartItems.map(item =>
        (<li key={item.id}>{item.name}</li>)
      )}
    </ul>
  </div>
);

DummyApplicationContainer.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cartItems: state.timetravel.cartItems,
});

const mapDispatchToProps = (dispatch) => ({
  onAddToCart: (newCartItem) =>
    timetravelDispatcher(dispatch, addToCart(newCartItem)),
  onCheckout: () =>
    timetravelDispatcher(dispatch, checkout()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DummyApplicationContainer);
