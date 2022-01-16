import React from "react";
import { RouteComponentProps } from "react-router-dom";
import AuthButton from "../components/AuthButton";
import Follow from "../components/Follow";

interface MatchParams {
  id: string;
}

interface FollowPageProps extends RouteComponentProps<MatchParams> {}

const FollowPage: React.FC<FollowPageProps> = ({ match }) => {
  return (
    <div>
      <AuthButton />
      <Follow id={match.params.id} />
    </div>
  );
};

export default FollowPage;
