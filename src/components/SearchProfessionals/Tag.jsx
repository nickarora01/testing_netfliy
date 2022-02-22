import React from "react";
import styled from "styled-components";
import { Button } from "@chakra-ui/react";

const Tag = (props) => {
  return (
    <Container
      show={props.show}
      onClick={props.onClick}
      {...props}
      tabIndex={0}
    >
      {props.label}
    </Container>
  );
};

export default Tag;

const Container = styled(Button)`
  display: ${(props) => (props.show ? `${props.show} !important` : "block")};
  cursor: pointer;
  margin-right: 0.8rem;
  min-width: 40px;
  text-align: center;
  font-size: 0.9rem !important;
  font-weight: 500 !important;
  padding: 0.4rem 1rem;
  border-radius: 5rem !important;
  background-color: transparent !important;
  border: 1.2px solid #b0b0b0;
  transition: 0.3s;
  :hover,
  :focus {
    border-color: ${(props) => props.theme.color.green};
    color: ${(props) => props.theme.color.green};
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin-top: 1rem;
  }
`;
