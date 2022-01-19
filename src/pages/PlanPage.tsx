import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import AuthButton from "../components/AuthButton";
import Share from "../components/Share";
import Follow from "../components/Follow";
import {
  CreateJourney,
  CREATE_JOURNEY,
  JourneyStatus,
  UpdateJourneyPosition,
  UpdateJourneyPositionVars,
  UpdateJourneyStatus,
  UpdateJourneyStatusVars,
  UPDATE_JOURNEY_POSITION,
  UPDATE_JOURNEY_STATUS,
} from "../graph/journey";
import { Button, CircularProgress } from "@mui/material";

const LocalStorageKey = "journeyKey";

const PlanPage = () => {
  const [journeyId, setJourneyId] = useState<string | null>(
    localStorage.getItem(LocalStorageKey)
  );
  const [journeyStatus, setJourneyStatus] = useState<JourneyStatus | null>(
    journeyId ? JourneyStatus.Active : null
  );

  return (
    <div>
      <AuthButton />
      {journeyId && journeyStatus ? (
        <div>
          <Follow id={journeyId} />
          <UpdateJourneyStatusButton
            journeyId={journeyId}
            setJourneyStatus={setJourneyStatus}
            status={journeyStatus}
          />
          {journeyStatus === JourneyStatus.Active ? (
            <div>
              <Share journeyId={journeyId} />
              <JourneyPositionUpdater journeyId={journeyId} />
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          <CreateJourneyButton
            setJourneyId={setJourneyId}
            setJourneyStatus={setJourneyStatus}
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

  if (loading)
    return (
      <div>
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <Button
        variant="contained"
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
              const status = result.data?.updateJourneyStatus.status;
              if (status) setJourneyStatus(status);
              if (status === JourneyStatus.Active)
                localStorage.removeItem(LocalStorageKey);
            })
            .catch((e) =>
              console.log(`could not update journey status : ${e}`)
            );
        }}
      >
        {status === JourneyStatus.Active
          ? "Complete Jouney"
          : "Continue Journey"}
      </Button>
    </div>
  );
};

interface CreateJourneyProps {
  setJourneyId: React.Dispatch<React.SetStateAction<string | null>>;
  setJourneyStatus: React.Dispatch<React.SetStateAction<JourneyStatus | null>>;
}

const CreateJourneyButton: React.FC<CreateJourneyProps> = ({
  setJourneyId,
  setJourneyStatus,
}) => {
  const [createJourney, { loading }] =
    useMutation<CreateJourney>(CREATE_JOURNEY);

  if (loading)
    return (
      <div>
        <CircularProgress />
      </div>
    );

  return (
    <div>
      <Button
        variant="contained"
        onClick={() => {
          createJourney()
            .then((result) => {
              const id = result.data?.createJourney.id;
              const status = result.data?.createJourney.status;
              if (id) {
                setJourneyId(id);
                localStorage.setItem(LocalStorageKey, id);
              }
              if (status) setJourneyStatus(status);
            })
            .catch((e) => console.log(`could not create journey : ${e}`));
        }}
      >
        Create Journey
      </Button>
    </div>
  );
};

interface JourneyPositionUpdaterProps {
  journeyId: string;
}

const JourneyPositionUpdater: React.FC<JourneyPositionUpdaterProps> = ({
  journeyId,
}) => {
  let watchId = 0;

  const [updateJourneyPosition] = useMutation<
    UpdateJourneyPosition,
    UpdateJourneyPositionVars
  >(UPDATE_JOURNEY_POSITION);

  useEffect(() => {
    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [watchId]);

  const updateLocation = (position: GeolocationPosition): void => {
    console.log(
      "New position at: " +
        position.coords.latitude +
        ", " +
        position.coords.longitude
    );
    updateJourneyPosition({
      variables: {
        input: {
          id: journeyId,
          position: {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          },
        },
      },
    }).catch((e) => console.log(`could not update journey position : ${e}`));
  };

  if (navigator.geolocation) {
    watchId = navigator.geolocation.watchPosition(
      updateLocation,
      (e: GeolocationPositionError): void => {
        console.log(`unable to watch position : ${e}`);
      }
    );
  } else {
    console.log("geolocation is not supported by this browser");
  }

  return null;
};
