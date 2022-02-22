import React from "react";
import styled from "styled-components";
import { Box, Text, Image, Button } from "@chakra-ui/react";
import { useHistory } from "react-router-dom";
import { theme } from "../../theme";

import certified from "../../assets/icons/home/certified.svg";
import hands from "../../assets/icons/home/hands.svg";
import mail from "../../assets/icons/home/mail.svg";

const SectionBenefits = (props) => {
  const history = useHistory();

  return (
    <MySection as="section" id="benefits">
      <Title>Benefícios</Title>
      <Grid>
        <Card>
          <Image draggable={false} src={hands} alt="aperto de mão" />
          <Text>É fácil, é rápido, você trata diretamente com quem faz.</Text>
        </Card>
        <Card>
          <Image draggable={false} src={certified} alt="certificado" />
          <Text>Profissionais com cadastros certificados.</Text>
        </Card>
        <Card>
          <Image draggable={false} src={mail} alt="correio" />
          <Text>Profissionais para receber pedidos em sua casa.</Text>
        </Card>
      </Grid>
      <Button
        marginTop="50px"
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
        Quero contratar um Home Assistant
      </Button>
    </MySection>
  );
};

export default SectionBenefits;

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

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  line-height: 2.125rem;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    margin: 0 0 18px 0;
  }
`;

const Grid = styled(Box)`
  margin-top: 50px;
  display: grid;
  align-items: center;
  grid-template-columns: repeat(3, 1fr);
  width: 100%;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    grid-template-columns: 1fr;
    grid-gap: 20px;
  }
`;

const Card = styled(Box)`
  height: 240px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  p {
    max-width: 266px;
    text-align: center;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
  }
`;
