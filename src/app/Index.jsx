import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import browserHistory from 'history/lib/createBrowserHistory';
import useRouterHistory from 'react-router/lib/useRouterHistory';
import { syncHistoryWithStore } from 'react-router-redux';
import configureStore from 'infrastructure/store/configureStore'

const store = configureStore();
const routerHistory = useRouterHistory(browserHistory)({ basename: '' });;
const history = syncHistoryWithStore(routerHistory, store);

const renderApp = () => {
  const RouterContainer = require('./RouterContainer').default;
  ReactDOM.render(
    <Provider store={store}>
      <RouterContainer history={history} />
    </Provider>,
    document.getElementById('app-container')
  );
};

renderApp();

if (module.hot) {
  module.hot.accept('./RouterContainer', () => {
    renderApp();
  });
}
