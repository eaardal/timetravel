import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './AppContainer';
import ApplicationContainer from 'features/timetravel/ApplicationContainer';

const routes = (
    <Route path="/" component={App}>
      <IndexRoute component={ApplicationContainer} />
    </Route>
);

export default routes;
