import React, { useEffect } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { useStore, useActions } from "../configureStore";

const Policy = () => {
  const item = useStore((store) => store.staticPages.item);
  const getList = useActions((action) => action.staticPages.getList);

  useEffect(() => {
    getList();
  }, []);

  return (
    <Container>
      <Title>
        <FormattedMessage
          id="app.footerPoliticas"
          defaultMessage="Política de Privacidade"
        />
      </Title>
      <div
        dangerouslySetInnerHTML={{
          __html: item && item[0] ? item[0].policy : "",
        }}
      />
    </Container>
  );
};

export default Policy;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1em;
  min-height: 500px;
`;

const Title = styled.h1`
  font-size: 2em;
  text-align: center;

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    font-size: 1.8em;
  }
`;
