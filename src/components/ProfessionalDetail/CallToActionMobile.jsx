import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { Box, Icon, Button } from "@chakra-ui/react";
import { theme } from "../../theme";
import { ValidPermission } from "../../services/user";
import { toaster } from "evergreen-ui";
import { useActions, useStore } from "../../configureStore";

const CallToActionMobile = (props) => {
  const history = useHistory();
  const create = useActions((action) => action.chat.create);
  const user = useStore((state) => state.professional.professional);
  const isAuth = useStore((state) => state.auth.isAuthenticated);

  return (
    <Container>
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
    </Container>
  );
};

export default CallToActionMobile;

const Container = styled(Box)`
  align-items: center;
  justify-content: center;
  background-color: ${(props) => props.theme.color.white};
  position: fixed;
  padding: 0px 24px;
  min-height: 80px;
  width: 94%;
  bottom: 0;
  left: 0;
  box-shadow: rgba(0, 0, 0, 0.28) 0px 8px 28px;
  display: none;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: flex;
    width: 94%;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 88%;
  }
`;

const MyButton = styled(Button)`
  cursor: pointer;
  width: 100% !important;
  background-color: ${(props) => props.theme.color.green} !important;
  color: ${(props) => props.theme.color.white} !important;
  border: 0;
  font-weight: 600 !important;
  height: 48px !important;
  :focus,
  :hover {
    opacity: 0.7;
  }
`;
