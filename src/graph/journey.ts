import { gql } from "@apollo/client";

export enum JourneyStatus {
  Active = "ACTIVE",
  Complete = "COMPLETE",
}

export type SubscribeJourney = {
  journey: Journey;
};

export type Journey = {
  id: string;
  user: User;
  status: JourneyStatus;
};

export type User = {
  id: string;
};

export interface JourneyVars {
  journeyID: string;
}

export type CreateJourney = {
  createJourney: Journey;
};

export const JOURNEY = gql`
  subscription Journey($journeyID: UUID!) {
    journey(id: $journeyID) {
      id
      user {
        id
      }
      status
    }
  }
`;

export const CREATE_JOURNEY = gql`
  mutation CreateJourney {
    createJourney {
      id
      user {
        id
      }
      status
    }
  }
`;

export type UpdateJourneyStatus = {
  updateJourneyStatus: Journey;
};

export interface UpdateJourneyStatusVars {
  id: string;
  status: JourneyStatus;
}

export const UPDATE_JOURNEY_STATUS = gql`
  mutation UpdateJourneyStatus($status: JourneyStatus!, $id: UUID!) {
    updateJourneyStatus(input: { status: $status, id: $id }) {
      id
      user {
        id
      }
      status
    }
  }
`;
