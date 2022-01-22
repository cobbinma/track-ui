import { Container, Stack } from "@mui/material";
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
      <Container maxWidth="md">
        <Stack spacing={2}>
          <AuthButton />
          <Follow id={match.params.id} />
        </Stack>
      </Container>
    </div>
  );
};

export default FollowPage;
