import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import rootReducer from 'app/rootReducer';

let reduxDevTools = f => f;
if (process.env.ENVIRONMENT === 'localhost' && window.devToolsExtension) {
  reduxDevTools = window.devToolsExtension();
}

export default function configureStore() {
  const store = createStore(
    rootReducer,
    compose(
      applyMiddleware(thunkMiddleware),
      reduxDevTools
    )
  );

  if (module.hot) {
    // Enable Webpack hot module replacement for reducers
    module.hot.accept('app/rootReducer', () => {
      const nextRootReducer = require('app/rootReducer').default;
      store.replaceReducer(nextRootReducer);
    });
  }

  return store;
}
