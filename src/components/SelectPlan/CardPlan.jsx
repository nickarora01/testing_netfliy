import React from "react";
import styled from "styled-components";
import {
  Pane,
  Heading,
  Icon,
  UnorderedList,
  ListItem,
  Button,
  Text,
} from "evergreen-ui";

const CardPlan = (props) => {
  return (
    <Container>
      <Title>{props.title}</Title>

      <WrapAmount>
        <Icon icon="euro" />
        <Amount>{props.amount}</Amount>
      </WrapAmount>

      {props.iva?.length > 0 && <IvaText>{props.iva}</IvaText>}
      <Separate />

      <UnorderedList>
        <ListItem icon={"tick-circle"} iconColor="#45B980">
          Acesso completo a plataforma
        </ListItem>
        {props.description?.length > 0 && (
          <ListItem icon={"tick-circle"} iconColor="#45B980">
            {props.description}
          </ListItem>
        )}
      </UnorderedList>
      <Pane height="55px">{props.paypal}</Pane>
    </Container>
  );
};

export default CardPlan;

const Container = styled(Pane)`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 1rem;
  box-shadow: ${(props) => props.theme.boxShadow};
  min-height: 300px;
`;

const Title = styled(Heading)`
  font-size: 1.8rem;
  text-align: center;
`;

//AMOUNT

const WrapAmount = styled(Pane)`
  margin: 1rem 0 0 1rem;
  display: flex;
  align-items: flex-start;
  justify-content: center;
`;

const Amount = styled(Pane)`
  font-size: 2rem;
`;

const Separate = styled(Pane)`
  width: 100%;
  height: 1px;
  background-color: #eee;
`;

const IvaText = styled(Text)`
  font-size: 1rem;
  text-align: center;
`;
