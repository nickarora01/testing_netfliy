import React from "react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { Box, Image, Button } from "@chakra-ui/react";
import { theme } from "../../theme";
import { useStore, useActions } from "../../configureStore";

import airplane from "../../assets/images/services.jpeg";

const SectionFindSolution = (props) => {
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);

  return (
    <Container as="section">
      <Content>
        <Box display="flex" flexDirection="column" alignItems="flex-start">
          <Title as="h2" color={theme.color.darkBlue}>
            Aqui você encontra a solução que vai facilitar a sua vida!
          </Title>
          {/* {!isAuthenticated && (
            <Button
              height="48px"
              cursor="pointer"
              backgroundColor={theme.color.green}
              border="none"
              color={theme.color.white}
              borderRadius={".2rem"}
              fontWeight={500}
              onClick={() => {
                window.scrollTo(0, 0);
                props.history.push("/cadastro/wizard/");
              }}
              _hover={{
                backgroundColor: theme.color.green,
                opacity: 0.8,
              }}
            >
              Fazer meu cadastro
            </Button>
          )} */}
        </Box>
        <CustomImage src={airplane} draggable="false" alt="avião" />
      </Content>
    </Container>
  );
};

export default withRouter(SectionFindSolution);

const Container = styled(Box)`
  background-color: ${(props) => props.theme.color.white};
  padding: 50px 0;
`;

const Content = styled(Box)`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 0 2em;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    flex-direction: column;
    padding: 0 2em;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 0 1em;
  }
`;

const Title = styled(Box)`
  max-width: 581px;
  font-size: 2rem;
  line-height: 3.5rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    line-height: 3rem;
  }
`;

const CustomImage = styled(Image)`
  max-width: 463px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    margin-top: 1rem;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 100%;
    height: 100%;
  }
`;
