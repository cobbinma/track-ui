import { useSubscription } from "@apollo/client";
import { Chip, CircularProgress } from "@mui/material";
import {
  JOURNEY,
  SubscribeJourney,
  JourneyVars,
  JourneyStatus,
} from "../graph/journey";
import Map from "./Map";

interface FollowProps {
  id: string;
}

const Follow: React.FC<FollowProps> = ({ id }) => {
  const { loading, data, error } = useSubscription<
    SubscribeJourney,
    JourneyVars
  >(JOURNEY, { variables: { journeyID: id } });

  if (error) return <div>`Error! ${error.message}`</div>;

  return (
    <div>
      {loading ? (
        <CircularProgress />
      ) : (
        <Chip
          label={data?.journey.status}
          color={
            data?.journey.status === JourneyStatus.Active
              ? "warning"
              : "success"
          }
        />
      )}
      {data?.journey.position ? (
        <Map lat={data.journey.position.lat} lng={data.journey.position.lng} />
      ) : null}
    </div>
  );
};

export default Follow;
