import { useSubscription } from "@apollo/client";
import AuthButton from "./AuthButton";
import { JOURNEY, Journey, JourneyVars } from "./graph/journey";

const Follow = () => {
  const getLastItem = (thePath: string) =>
    thePath.substring(thePath.lastIndexOf("/") + 1);
  const { loading, data, error } = useSubscription<Journey, JourneyVars>(
    JOURNEY,
    { variables: { journeyID: getLastItem(window.location.pathname) } }
  );

  if (error)
    return (
      <div>
        <AuthButton />
        `Error! ${error.message}`
      </div>
    );

  return (
    <div>
      <AuthButton />
      Follow
      {loading ? "Loading..." : "Status:" + data?.journey.status}
    </div>
  );
};

export default Follow;
