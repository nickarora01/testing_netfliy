import React, { useEffect } from "react";
import styled from "styled-components";
import { FormattedMessage } from "react-intl";
import { useStore, useActions } from "../configureStore";

const Help = () => {
  const item = useStore((store) => store.staticPages.item);
  const getList = useActions((action) => action.staticPages.getList);

  useEffect(() => {
    getList();
  }, []);

  return (
    <Container>
      <Title>
        <FormattedMessage id="app.ajuda" defaultMessage="Ajuda" />
      </Title>
      <div
        dangerouslySetInnerHTML={{
          __html: item && item[0] ? item[0].help : "",
        }}
      />
    </Container>
  );
};

export default Help;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  width: auto;
  padding: 0 1em;
  > div {
  }
`;

const Title = styled.h1`
  font-size: 2em;
  text-align: center;
`;
