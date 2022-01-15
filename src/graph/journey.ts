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

export interface CreateJourneyVars {
  userID: string;
}

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
  mutation CreateJourney($userID: UUID!) {
    createJourney(input: { userId: $userID }) {
      id
      user {
        id
      }
      status
    }
  }
`;
