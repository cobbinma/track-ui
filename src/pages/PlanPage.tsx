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
import { Button, CircularProgress, Container, Stack } from "@mui/material";

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
      <Container maxWidth="md">
        <Stack spacing={2}>
          <AuthButton />
          {journeyId && journeyStatus ? (
            <div>
              <Stack spacing={2}>
                <Follow id={journeyId} />
                {journeyStatus === JourneyStatus.Active ? (
                  <div>
                    <Stack direction="row" spacing={1}>
                      <UpdateJourneyStatusButton
                        journeyId={journeyId}
                        setJourneyStatus={setJourneyStatus}
                        status={journeyStatus}
                      />
                      <Share journeyId={journeyId} />
                    </Stack>
                    <JourneyPositionUpdater journeyId={journeyId} />
                  </div>
                ) : null}
              </Stack>
            </div>
          ) : (
            <div>
              <CreateJourneyButton
                setJourneyId={setJourneyId}
                setJourneyStatus={setJourneyStatus}
              />
            </div>
          )}
        </Stack>
      </Container>
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
              if (status === JourneyStatus.Complete)
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
  const [updateJourneyPosition] = useMutation<
    UpdateJourneyPosition,
    UpdateJourneyPositionVars
  >(UPDATE_JOURNEY_POSITION);

  useEffect(() => {
    let watchId: number | null = null;
    const updateLocation = (position: GeolocationPosition) => {
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
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [updateJourneyPosition, journeyId]);

  return null;
};
