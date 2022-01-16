import { useMutation } from "@apollo/client";
import { useAuth0 } from "@auth0/auth0-react";
import React, { useState } from "react";
import AuthButton from "../components/AuthButton";
import Share from "../components/Share";
import Follow from "../components/Follow";
import {
  CreateJourney,
  CREATE_JOURNEY,
  JourneyStatus,
  UpdateJourneyStatus,
  UpdateJourneyStatusVars,
  UPDATE_JOURNEY_STATUS,
} from "../graph/journey";

const PlanPage = () => {
  const [journeyId, setJourneyId] = useState<string | null>(null);
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus | null>(
    null
  );
  const { user, isLoading } = useAuth0();

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <div>
      <AuthButton />
      {journeyId && journeyStatus ? (
        <div>
          <Follow id={journeyId} />
          <Share journeyId={journeyId} />
          <UpdateJourneyStatusButton
            journeyId={journeyId}
            setJourneyStatus={setJourneyStatus}
            status={journeyStatus}
          />
        </div>
      ) : (
        <div>
          <CreateJourneyButton
            setJourneyId={setJourneyId}
            setJourneyStatus={setJourneyStatus}
            userId={user?.sub || ""}
          />
        </div>
      )}
    </div>
  );
};

export default PlanPage;

interface UpdateJourneyStatusButtonProps {
  journeyId: string;
  status: JourneyStatus;
  setJourneyStatus: React.Dispatch<React.SetStateAction<JourneyStatus | null>>;
}

const UpdateJourneyStatusButton: React.FC<UpdateJourneyStatusButtonProps> = ({
  journeyId,
  status,
  setJourneyStatus,
}) => {
  const [updateJourneyStatus, { loading }] = useMutation<
    UpdateJourneyStatus,
    UpdateJourneyStatusVars
  >(UPDATE_JOURNEY_STATUS);

  if (loading) return <div>Submitting...</div>;

  return (
    <div>
      <button
        onClick={() => {
          updateJourneyStatus({
            variables: {
              id: journeyId,
              status:
                status === JourneyStatus.Active
                  ? JourneyStatus.Complete
                  : JourneyStatus.Active,
            },
          })
            .then((result) => {
              setJourneyStatus(result.data?.updateJourneyStatus.status || null);
            })
            .catch((e) => {
              console.log("could not update journey status");
              console.log(e);
            });
        }}
      >
        {status === JourneyStatus.Active
          ? "Complete Jouney"
          : "Continue Journey"}
      </button>
    </div>
  );
};

interface CreateJourneyProps {
  setJourneyId: React.Dispatch<React.SetStateAction<string | null>>;
  setJourneyStatus: React.Dispatch<React.SetStateAction<JourneyStatus | null>>;
  userId: string;
}

const CreateJourneyButton: React.FC<CreateJourneyProps> = ({
  setJourneyId,
  setJourneyStatus,
  userId,
}) => {
  const [createJourney, { loading }] = useMutation<
    CreateJourney
  >(CREATE_JOURNEY);

  if (loading) return <div>Submitting...</div>;

  return (
    <div>
      <button
        onClick={() => {
          createJourney({ variables: { userID: userId } })
            .then((result) => {
              setJourneyId(result.data?.createJourney.id || null);
              setJourneyStatus(result.data?.createJourney.status || null);
            })
            .catch((e) => {
              console.log("could not create journey");
              console.log(e);
            });
        }}
      >
        Create Journey
      </button>
    </div>
  );
};
