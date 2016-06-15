import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { addToCart, checkout } from './timetravel.actions';
import guid from '../../utils/guid.util';
import timetravelDispatcher from './timetravelDispatcher';
import TimetravelContainer from './TimetravelContainer';
import {
  Navbar, Nav, NavItem, Col, Row, Button, ListGroup, ListGroupItem
} from 'react-bootstrap';

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

const renderCartItems = (cartItems) =>
  cartItems && cartItems.length > 0
    ? <div>
        <h3>Cart items:</h3>
        <ListGroup>
          {cartItems.map(item =>
            <ListGroupItem key={item.id}>
              {item.name}
            </ListGroupItem>)}
        </ListGroup>
      </div>
    : null;

const renderIsCheckingOut = (isCheckingOut) =>
  isCheckingOut
    ? <h4>Started checkout!</h4>
    : null;

const ApplicationContainer = ({ onAddToCart, onCheckout, cartItems, isCheckingOut }) => (
  <div>
    <Navbar>
      <Navbar.Header>
        <Navbar.Brand>
          <a href="#">Timetravel</a>
        </Navbar.Brand>
      </Navbar.Header>
    </Navbar>
    <div className="container">
      <Row>
        <Col md={6}>
          <Button onClick={() => addRandomItemToCart(onAddToCart)}>Add to cart</Button>
          &nbsp;
          <Button onClick={onCheckout}>Checkout</Button>
          {renderCartItems(cartItems)}
          {renderIsCheckingOut(isCheckingOut)}
        </Col>
        <Col md={6}>
          <TimetravelContainer />
        </Col>
      </Row>
    </div>
  </div>
);

ApplicationContainer.propTypes = {
  onAddToCart: PropTypes.func.isRequired,
  onCheckout: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cartItems: state.timetravel.cartItems,
  isCheckingOut: state.timetravel.isCheckingOut,
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
)(ApplicationContainer);
