import React from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";

const AboutUs = () => {
  return (
    <Container>
      <Title>
        <FormattedMessage id="app.quemSomos" defaultMessage="Quem somos" />
      </Title>
      <div></div>
    </Container>
  );
};

export default AboutUs;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1em;
  min-height: 500px;
`;

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
`;
