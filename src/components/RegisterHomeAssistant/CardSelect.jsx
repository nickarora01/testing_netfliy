import React from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";

const CardSelect = (props) => {
  return (
    <Container
      {...props}
      marginR={props.marginR}
      marginL={props.marginL}
      selected={props.selected}
      onClick={props.handleClick}
    >
      <Header>{props.header}</Header>
      <Description>
        <Line>{props.description}</Line>
        <Line>Já tem o seu código de indicação?</Line>
        <Line>Inscreva-se aqui</Line>
      </Description>
    </Container>
  );
};

export default CardSelect;

const Container = styled(Box)`
  border: ${(props) =>
    props.selected ? `2px solid ${props.theme.color.green}` : `2px solid #eee`};
  min-height: 150px;
  max-width: 230px;
  border-radius: 0.2rem;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    border: 2px solid ${(props) => props.theme.color.green};
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    max-width: 100%;
    margin: 0 0 1rem 0 !important;
  }
`;

const Header = styled(Box)`
  height: 20px;
  padding: 1rem;
  background-color: #edf5f9;
  font-weight: 600;
`;

const Description = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 1rem;
`;

const Line = styled.span``;
