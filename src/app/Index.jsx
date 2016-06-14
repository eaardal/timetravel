import 'babel-polyfill';
import 'infrastructure/polyfills/scrollIntoViewIfNeeded.polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import browserHistory from 'history/lib/createBrowserHistory';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'infrastructure/store/configureStore';
import moment from 'moment';
import 'react-fastclick';
import i18n from 'i18n/i18nCache';
import loadPolyfills from 'infrastructure/polyfills/loadPolyfills';

const store = configureStore();
const routerHistory = useRouterHistory(browserHistory)({ basename: '/dbank/innlogget/betaling/' });
const history = syncHistoryWithStore(routerHistory, store);

const renderApp = () => {
  const RouterContainer = require('./RouterContainer').default;
  ReactDOM.render(
    <Provider store={store}>
      <RouterContainer history={history} />
    </Provider>,
    document.getElementById('betaling-app-container')
  );
};

const configureMoment = () => moment.locale('nn');

const configureMobileAppViewport = () => {
  if (navigator.userAgent.match(/SpvApp/i)) {
    const viewport = document.getElementById('mainViewport');
    const attributes = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no';
    viewport.setAttribute('content', attributes);
  }
};

const runApp = () => {
  configureMoment();
  configureMobileAppViewport();
  loadPolyfills(() => {
    i18n.initialize();
    renderApp();
  });
};

runApp();

if (module.hot) {
  module.hot.accept('./RouterContainer', () => {
    renderApp();
  });
}
