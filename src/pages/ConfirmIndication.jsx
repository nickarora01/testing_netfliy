import React, { useEffect } from "react";
import styled from "styled-components";
import queryString from "query-string";
import { IndicationConfirm } from "../services/staticPages";

const ConfirmIndication = () => {
  const query = queryString.parse(window.location.search);

  useEffect(() => {
    if (query?.from_email && query?.to_email) {
      IndicationConfirm(query.from_email, query.to_email);
    }
  }, [query]);

  return (
    <Container>
      <Title>Obrigado por confirmar a indicação!</Title>
    </Container>
  );
};

export default ConfirmIndication;

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
