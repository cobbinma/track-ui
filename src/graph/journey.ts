import { gql } from "@apollo/client";

export enum JourneyStatus {
  Active = "ACTIVE",
  Complete = "COMPLETE",
}

export type Journey = {
  journey: {
    id: string;
    user: User;
    status: JourneyStatus;
  };
};

export type User = {
  id: string;
};

export interface JourneyVars {
  journeyID: string;
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
