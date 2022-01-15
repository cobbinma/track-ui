import React from "react";
import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Route } from "react-router-dom";

const ProtectedRoute = ({
  component,
  ...args
}: React.PropsWithChildren<any>) => (
  <Route
    render={(props) => {
      let Component = withAuthenticationRequired(component, {});
      return <Component {...props} />;
    }}
    {...args}
  />
);

export default ProtectedRoute;
