import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { AppState, Auth0Provider } from '@auth0/auth0-react';
import { createBrowserHistory } from 'history';
import Follow from './Follow';
import Plan from './Plan';
import ProtectedRoute from './ProtectedRoute'

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

export default function App() {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;

  return (
    <Auth0Provider
        domain={domain || ""}
        clientId={clientId || ""}
        redirectUri={window.location.origin}
        onRedirectCallback={onRedirectCallback}
      >
      <Router history={history}>
        <Switch>
          <ProtectedRoute path="/" exact component={Plan}/>
          <ProtectedRoute path="/follow/:id" component={Follow} />
        </Switch>
      </Router>
    </Auth0Provider>
  );
}
