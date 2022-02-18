import React from "react";
import styled from "styled-components";
import { Box, Text, Image } from "@chakra-ui/react";

import noUser from "../../assets/icons/nouser.svg";

const MiniCardAboutUser = (props) => {
  return (
    <Container id="aboutUser">
      <MyImage src={noUser} />
      <Title as="h2">Lorem ipsum dolor sit amet</Title>
      <Description>
        Lorem ipsum dolor sit amet, lorem ipsum dolor sit amet.
      </Description>
    </Container>
  );
};

export default MiniCardAboutUser;

const Container = styled(Box)`
  cursor: default;
  display: grid;
  grid-gap: 0 10px;
  min-height: 60px;
  align-items: flex-start;
  margin: 1rem 0 2rem 0;
  grid-template-areas:
    "image title"
    "image description";
  grid-template-columns: 56px 1fr;
  justify-content: space-around;
`;

const MyImage = styled(Image)`
  grid-area: image;
  border-radius: 10rem;
  width: 56px;
  height: 56px;
  margin-right: 1rem;
`;

const Title = styled(Box)`
  grid-area: title;
  margin: 0 0 0 0;
  font-size: 1.2rem;
  padding: 0;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    font-size: 1rem;
  }
`;

const Description = styled(Text)`
  grid-area: description;
  font-size: 1rem;
  color: #555;
  margin: 0;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin-top: 1rem;
    font-size: 0.99rem;
  }
`;
