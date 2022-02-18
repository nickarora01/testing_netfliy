import React from "react";
import styled from "styled-components";
import { Box, Button, Text } from "@chakra-ui/react";
import { withRouter } from "react-router-dom";
import { useActions, useStore } from "../../configureStore";
import { ValidPermission } from "../../services/user";
import { toaster } from "evergreen-ui";

const BoxCallToAction = (props) => {
  const create = useActions((action) => action.chat.create);
  const user = useStore((state) => state.professional.professional);
  const isAuth = useStore((state) => state.auth.isAuthenticated);

  return (
    <Container {...props}>
      <Header>
        {/* <Value>
          <b>R$168</b> / hora
        </Value> */}
        {/* <Rating>
          <Icon
            marginBottom={".1rem"}
            marginRight={".2rem"}
            name="star"
            color={theme.color.green}
            size="12px"
          />
          4,89 (74)
        </Rating> */}
      </Header>
      <Box height="30px" />
      <Row>
        {/* <Text>Semanal</Text> */}
        {/* <Text>R$840</Text> */}
      </Row>
      <MyButton
        onClick={async () => {
          if (isAuth) {
            const response = await ValidPermission();
            if (
              response.data?.results &&
              response.data?.results.status === "ok"
            ) {
              create(user?.id);
              props.history.push("/conta?tab=3");
              window.scrollTo(0, 0);
            } else {
              toaster.warning(
                "Você precisa compra um dos nossos planos para entrar em contato com este profissional",
                { id: "plan-me" }
              );
            }
          } else {
            props.history.push("/entrar");
            window.scrollTo(0, 0);
          }
        }}
      >
        Entrar em contato
      </MyButton>
      <Text textAlign="center">Mande mensagem para o {user.name}</Text>
    </Container>
  );
};

export default withRouter(BoxCallToAction);

const Container = styled(Box)`
  transition: 0.3s;
  cursor: default;
  /* right: 350px; */
  top: 0;
  border: 1px solid rgb(221, 221, 221);
  box-shadow: rgba(0, 0, 0, 0.12) 0px 6px 16px;
  border-radius: 12px;
  padding: 24px;
  width: 300px;
  height: 190px;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    right: 160px;
  }
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    right: 50px;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    margin-top: 0 !important;
  }
`;

const Header = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Value = styled(Box)`
  b {
    font-size: 1.3rem;
  }
`;

const Rating = styled(Box)`
  font-size: 0.9rem;
  display: flex;
  align-items: center;
`;

const MyButton = styled(Button)`
  margin-top: 0.5rem;
  cursor: pointer;
  width: 100% !important;
  background-color: ${(props) => props.theme.color.green} !important;
  color: ${(props) => props.theme.color.white} !important;
  border: 0;
  font-weight: 600 !important;
  height: 58px !important;
  :focus,
  :hover {
    opacity: 0.7;
  }
`;

const BoldText = styled(Text)`
  font-weight: 600;
  margin: 0;
  font-size: 1.2rem;
`;

const Row = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
  p {
    margin: 0;
  }
`;
