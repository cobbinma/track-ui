import React from "react";
import { Router, Switch } from "react-router-dom";
import { AppState, Auth0Provider } from "@auth0/auth0-react";
import { createBrowserHistory } from "history";
import FollowPage from "./pages/FollowPage";
import AuthorizedApolloProvider from "./graph/AuthorizedApolloProvider";
import ProtectedRoute from "./ProtectedRoute";
import PlanPage from "./pages/PlanPage";

export const history = createBrowserHistory();

const onRedirectCallback = (appState: AppState) => {
  history.replace(appState?.returnTo || window.location.pathname);
};

export default function App() {
  const domain = process.env.REACT_APP_AUTH0_DOMAIN;
  const clientId = process.env.REACT_APP_AUTH0_CLIENT_ID;
  const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

  return (
    <Auth0Provider
      domain={domain || ""}
      clientId={clientId || ""}
      redirectUri={window.location.origin}
      onRedirectCallback={onRedirectCallback}
      audience={audience}
    >
      <AuthorizedApolloProvider>
        <Router history={history}>
          <Switch>
            <ProtectedRoute path="/" exact component={PlanPage} />
            <ProtectedRoute path="/follow/:id" component={FollowPage} />
          </Switch>
        </Router>
      </AuthorizedApolloProvider>
    </Auth0Provider>
  );
}
