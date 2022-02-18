import React from "react";
import styled from "styled-components";
import { Box, Icon, Text } from "@chakra-ui/react";

const WorkCard = (props) => {
  return (
    <Card marginRight="1rem">
      <Icon name={props.icon} size={props?.width <= 440 ? "20px" : "30px"} />
      <TitleCard>{props.title}</TitleCard>
    </Card>
  );
};

const WorkTypes = (props) => {
  return (
    <Container>
      <Title as="h3">Tipos de Trabalho</Title>
      <ContainerBoxes>
        {props.categories?.map((item, idx) => (
          <WorkCard icon="settings" title={item?.name} />
        ))}
      </ContainerBoxes>
    </Container>
  );
};

export default WorkTypes;

const Container = styled(Box)`
  padding: 1.5rem 0 2rem 0;
`;

const Title = styled(Box)`
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
`;

const ContainerBoxes = styled(Box)`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
`;

const Card = styled(Box)`
  display: flex;
  flex-direction: column;
  border-radius: 0.4rem;
  border: 1px solid #ddd;
  width: 100%;
  height: 100px;
  margin: 0.5rem 0;
  max-width: 210px;
  padding: 1.5rem 1rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 1rem;
  }
`;
const TitleCard = styled(Text)`
  margin: 0;
  font-weight: 600;
  margin-top: 1rem;
  font-size: 1.2rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    font-size: 0.99rem;
  }
`;

// const DescriptionCard = styled(Text)`
//   margin: 0;
//   @media (max-width: ${(props) => props.theme.queries.sm}) {
//     font-size: 0.9rem;
//   }
// `;
