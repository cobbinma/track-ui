import { useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import { useState } from "react";
import AuthButton from "../components/AuthButton";
import Share from "../components/Share";
import Follow from "../components/Follow";
import {
  CreateJourney,
  CreateJourneyVars,
  CREATE_JOURNEY,
} from "../graph/journey";

const PlanPage = () => {
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <AuthButton />
      {journeyId ? (
        <div>
          <Follow id={journeyId} />
          <Share journeyId={journeyId} />
        </div>
      ) : (
        <div>
          <CreateJourneyButton
            setJourneyId={setJourneyId}
            userId={user?.sub || ""}
          />
        </div>
      )}
      Plan
    </div>
  );
};

export default PlanPage;

interface CreateJourneyProps {
  setJourneyId: React.Dispatch<React.SetStateAction<string | null>>;
  userId: string;
}

const CreateJourneyButton: React.FC<CreateJourneyProps> = ({
  setJourneyId,
  userId,
}) => {
  const [createJourney, { loading }] = useMutation<
    CreateJourney,
    CreateJourneyVars
  >(CREATE_JOURNEY);

  if (loading) return <div>Submitting...</div>;

  return (
    <div>
      <button
        onClick={() => {
          createJourney({ variables: { userID: userId } })
            .then((result) => {
              setJourneyId(result.data?.createJourney.id || null);
            })
            .catch((e) => {
              console.log("could not create journey");
              console.log(e);
            });
        }}
      >
        create journey
      </button>
    </div>
  );
};
