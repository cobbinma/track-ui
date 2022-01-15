import { useSubscription } from "@apollo/client";
import { JOURNEY, SubscribeJourney, JourneyVars } from "../graph/journey";

interface FollowProps {
  id: string;
}

const Follow: React.FC<FollowProps> = ({ id }) => {
  const { loading, data, error } = useSubscription<
    SubscribeJourney,
    JourneyVars
  >(JOURNEY, { variables: { journeyID: id } });

  if (error) return <div>`Error! ${error.message}`</div>;

  return <div>{loading ? "Loading..." : "Status:" + data?.journey.status}</div>;
};

export default Follow;
