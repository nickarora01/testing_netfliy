import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "evergreen-ui";
import { withRouter } from "react-router-dom";
import { FormattedMessage } from "react-intl";
import { useActions, useStore } from "../configureStore";

const ModalMenuMobile = props => {
  const [showBox, setShowBox] = useState("block");
  const setCategoryId = useActions(actions => actions.home.setCategoryId);

  const clear = () => {
    setShowBox("block");
  };

  const goToProduct = categoryId => {
    if (window.location.pathname === "/") {
      setCategoryId(categoryId);
      props.history.push(
        `/produtos?start=0&limit=20&pageNumber=0&sort=Mais Recente&series={}&materials={}&prices={}&category_id=${categoryId}`
      );
    } else {
      setCategoryId(categoryId);
      props.history.replace({
        pathname: "/produtos",
        search: `?start=0&limit=20&pageNumber=0&sort=Mais Recente&series={}&materials={}&prices={}&category_id=${categoryId}`,
        state: { some: "state" }
      });
    }
  };

  return (
    <Container display={props.display}>
      <Wrap>
        <SpaceBetweenItems>
          <Icon
            icon="cross"
            size={30}
            color="white"
            onClick={() => {
              props.close();
              clear();
            }}
          />
        </SpaceBetweenItems>
        <Breadcrumb onClick={() => clear()}>
          <FormattedMessage id="app.categorias" defaultMessage="Categorias" />
        </Breadcrumb>
        <Content style={{ display: showBox }}>
          <ul>
            {props.catg.map((item, index) => (
              <li
                key={index}
                onClick={() => {
                  goToProduct(item.id);
                  clear();
                  props.close();
                }}
              >
                <div>{item.title}</div>
              </li>
            ))}
          </ul>
        </Content>
      </Wrap>
    </Container>
  );
};
export default withRouter(ModalMenuMobile);
const Container = styled.div`
  display: ${({ display }) =>
    display !== undefined ? `${display} !important` : "none"};
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  width: 100%;
  min-height: 100%;
  z-index: 9999;
  background: #2a2928;
  overflow-y: auto;
`;
const Wrap = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  min-height: 450px;
`;
const Content = styled.div`
  width: 100%;
  height: 100%;
  min-height: 450px;
  li {
    color: #fff;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5em 1em;
    color: #a2a0a0;
    font-size: 17px;
    cursor: pointer;
    &:hover {
      color: #fff;
      transition: 0.2s;
    }
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0.8em 0.5em;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    height: 100%;
  }
`;
const SpaceBetweenItems = styled.div`
  padding: 1em 1em 0.5em 1em;
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  svg {
    cursor: pointer;
  }
`;
const Breadcrumb = styled.div`
  padding: 1em 1em 0.3em 1.2em;
  color: rgba(0, 0, 0, 0.5);
  font-weight: bold;
  color: #ccc;
  font-size: 18px;
`;
