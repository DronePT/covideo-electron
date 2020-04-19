import React from 'react';
import { Switch, Route } from 'react-router-dom';
import routes from './constants/routes.json';
import App from './containers/App';

// Pages
import HomePage from './containers/HomePage';
import JoinRoomPage from './containers/JoinRoomPage';
import CreateRoomPage from './containers/CreateRoomPage';

export default function Routes() {
  return (
    <App>
      <Switch>
        {/* <Route path={routes.COUNTER} component={CounterPage} /> */}
        <Route path={routes.CREATE_ROOM} component={CreateRoomPage} />
        <Route path={routes.JOIN_ROOM} component={JoinRoomPage} />
        <Route path={routes.HOME} component={HomePage} />
      </Switch>
    </App>
  );
}
