import * as React from 'react';
import { Route, Switch } from 'react-router-dom';

import LandingPage from '../container/LandingPage';
import Dashboard from '../container/Dashboard';
import NotFound from '../container/NotFound';

const App = () => (
  <Switch>
    <Route exact path="/" component={LandingPage} />
    <Route exact path="/dashboard" component={Dashboard} />
    <Route component={NotFound} />
  </Switch>
);

export default App;
