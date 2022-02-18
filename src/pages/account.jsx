import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Flex, Box, Avatar } from "@chakra-ui/react";

import { useStore } from "../configureStore";

//Components
import Sidebar from "../components/Account/Sidebar";

const Account = (props) => {
  const user = useStore((state) => state.user.profile);
  return (
    <Container>
      <Flex alignItems="center">
        <CustomAvatar
          name={user?.name}
          src={
            user?.image?.length > 0
              ? `${process.env.REACT_APP_ASSETS_BUCKET}/users/${user?.image}`
              : null
          }
        />
        <Flex>
          <UserName>{user?.name}</UserName>
        </Flex>
      </Flex>
      <Sidebar />
    </Container>
  );
};

export default withRouter(Account);

const Container = styled(Box)`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 5rem auto;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 0 1rem;
  }
`;

const UserName = styled(Box)`
  font-size: 1.5rem;
  color: ${(props) => props.theme.color.darkBlue};
  font-weight: bold;
  margin-left: 0.5rem;
`;

const CustomAvatar = styled(Avatar)`
  height: 56px;
  width: 56px;
  background-color: ${(props) => props.theme.color.green} !important;
`;
