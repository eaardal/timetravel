import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './AppContainer';
import DummyApplicationContainer from 'features/timetravel/DummyApplicationContainer';

const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={DummyApplicationContainer} />
    </Route>
);

export default routes;
