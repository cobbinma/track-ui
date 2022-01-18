import { useAuth0 } from "@auth0/auth0-react";
import { Button, CircularProgress } from "@mui/material";

function AuthButton() {
  const { isLoading, isAuthenticated, error, loginWithRedirect, logout } =
    useAuth0();

  if (isLoading) {
    return (
      <div>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <div>Oops... {error.message}</div>;
  }

  if (isAuthenticated) {
    return (
      <div>
        <Button
          variant="contained"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          Log out
        </Button>
      </div>
    );
  } else {
    return <button onClick={loginWithRedirect}>Log in</button>;
  }
}

export default AuthButton;
