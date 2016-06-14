import React, { PropTypes } from 'react';
import routes from './Routes';
import Router from 'react-router/lib/Router';

const RouterContainer = ({ history }) =>
  <Router history={ history } routes={ routes } />;

RouterContainer.propTypes = {
  history: PropTypes.object.isRequired,
};

export default RouterContainer;
