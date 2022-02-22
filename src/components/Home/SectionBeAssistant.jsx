import React from "react";
import styled from "styled-components";
import { withRouter, useHistory } from "react-router-dom";
import { Box, Image, Button, Text, List, ListItem } from "@chakra-ui/react";
import { theme } from "../../theme";
import { useStore, useActions } from "../../configureStore";

import man from "../../assets/images/home-assistent.jpeg";

const SectionBeAssistant = (props) => {
  const history = useHistory();
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);

  return (
    <Container as="section">
      <Content>
        <CustomImage src={man} draggable="false" alt="seja um assistente" />
        <ContainerGrid>
          <BoxBeAssistant>
            <Title as="h2" color={theme.color.darkBlue}>
              Seja um Home Assistant
            </Title>
            <Description maxWidth="513px">
              Você tem tempo disponível e pode prestar serviço remunerado perto
              da sua casa? Venha ser um Home Assistant!
            </Description>
            <CustomList styleType="disc" maxWidth="513px">
              <ListItem>Você consegue uma nova fonte de renda.</ListItem>
              <ListItem>
                Você conhece novas pessoas, que podem passar a te contratar com
                frequência.
              </ListItem>
              <ListItem>
                Você não precisa ter nenhuma habilidade técnica comprovada por
                diplomas ou certificados!
              </ListItem>
            </CustomList>
            {/* <ContainerButton>
              {!isAuthenticated && (
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
                    props.history.push("/cadastro/home-assistant");
                  }}
                  _hover={{
                    backgroundColor: theme.color.green,
                    opacity: 0.8,
                  }}
                >
                  Quero ser um Home Assistant
                </Button>
              )}
            </ContainerButton> */}
          </BoxBeAssistant>
          <BoxVideo>
            <iframe
              width="100%"
              height="350"
              src="https://www.youtube.com/embed/SsQmwXNMH3I"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </BoxVideo>
          <ContainerButton>
            {!isAuthenticated && (
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
                  props.history.push("/cadastro/wizard/home-assistant");
                }}
                _hover={{
                  backgroundColor: theme.color.green,
                  opacity: 0.8,
                }}
              >
                Seja um Home Assistant
              </Button>
            )}
            <Button
              height="48px"
              cursor="pointer"
              backgroundColor={theme.color.green}
              border="none"
              color={theme.color.white}
              borderRadius={".2rem"}
              fontWeight={500}
              _hover={{
                backgroundColor: theme.color.green,
                opacity: 0.8,
              }}
              onClick={() => {
                history.push(
                  "/profissionais?start=0&categories=&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=&home_assistent=true"
                );
              }}
            >
              Contratar um Home Assistant
            </Button>
          </ContainerButton>
        </ContainerGrid>
      </Content>
    </Container>
  );
};

export default withRouter(SectionBeAssistant);

const Container = styled(Box)`
  background-color: ${(props) => props.theme.color.white};
  padding: 50px 0;
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    padding: 50px 0rem;
  }
`;

const Content = styled(Box)`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  display: flex;
  align-items: center;
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

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  line-height: 2.125rem;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    margin: 0 0 18px 0;
  }
`;

const Description = styled(Text)`
  font-size: 1.125rem;
  line-height: 1.5625rem;
  margin-top: 0.3rem;
  color: #333333;
`;

const CustomList = styled(List)`
  li {
    font-size: 1.125rem;
    line-height: 1.5625rem;
    margin-top: 0.3rem;
    color: #333333;
    margin-bottom: 1rem;
  }
`;

const CustomImage = styled(Image)`
  max-width: 363px;
  max-height: 420px;
  margin-right: 50px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    margin: 1rem 0 3rem 0;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 100%;
    height: 100%;
  }
`;

const ContainerGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
  column-gap: 30px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const BoxVideo = styled.div``;

const BoxBeAssistant = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    align-items: center;
  }
`;

const ContainerButton = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-gap: 20px;
  width: 100%;

  @media (max-width: 1024px) {
    grid-template-columns: auto;
    grid-template-rows: auto auto;
    row-gap: 10px;
  }
`;
