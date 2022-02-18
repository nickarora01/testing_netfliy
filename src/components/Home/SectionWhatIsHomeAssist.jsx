import React from "react";
import styled from "styled-components";
import { Box, Text, Image } from "@chakra-ui/react";

import search from "../../assets/icons/home/search-card.svg";
import creditCard from "../../assets/icons/home/credit-card.svg";
import tools from "../../assets/icons/home/tools-card.svg";

const SectionWhatIsHomeAssist = (props) => {
  return (
    <MySection as="section" id="whatIs">
      <WhatIs>O que é o HomeAssist4u?</WhatIs>
      <Description>
        É o site que te permite contratar profissionais próximos à sua
        localização para te ajudar com diversos tipos de serviços. É fácil,
        rápido e muito eficiente:{" "}
      </Description>
      <Grid>
        <Card>
          <ImageCard draggable={false} src={search} alt="pesquisa" />
          <Text>Busque o serviço que você precisa através do nosso site.</Text>
        </Card>
        <Card>
          <ImageCard
            draggable={false}
            src={creditCard}
            alt="cartão de crédito"
          />
          <Text>
            Negocie diretamente com o profissional que deseja contratar.
          </Text>
        </Card>
        <Card>
          <ImageCard draggable={false} src={tools} alt="ferramentas" />
          <Text>Receba seu serviço e pague diretamente para o contratado.</Text>
        </Card>
      </Grid>
    </MySection>
  );
};

export default SectionWhatIsHomeAssist;

const MySection = styled(Box)`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  padding: 50px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    padding: 50px 0rem;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    padding: 50px 1rem;
  }
`;

const WhatIs = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  line-height: 2.125rem;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    margin: 0 0 18px 0;
  }
`;

const Description = styled(Text)`
  margin: 0;
  max-width: 720px;
  text-align: center;
  font-size: 1.125rem;
  line-height: 1 0.5625rem;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    text-align: left;
  }
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    text-align: center;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    text-align: left;
  }
`;

const Grid = styled(Box)`
  margin-top: 50px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  width: 98%;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
`;

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  align-items: center;
  p {
    max-width: 300px;
    text-align: center;
  }
`;

const ImageCard = styled(Image)`
  width: 170px;
  height: 170px;
`;
