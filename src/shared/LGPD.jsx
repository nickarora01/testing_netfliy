import React, { useState } from "react";
import { Button, SideSheet, Pane } from "evergreen-ui";
import styled from "styled-components";

const LGPD = (props) => {
  const [show, setShow] = useState(
    localStorage.getItem("accepted") === "true" ? false : true
  );

  const handleSelect = () => {
    setShow(false);
    localStorage.setItem("accepted", true);
  };

  return (
    <SideSheet
      position={"bottom"}
      isShown={show}
      shouldCloseOnOverlayClick={false}
    >
      <Pane
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding={20}
      >
        <Paragraph>
          Este site utiliza cookies para permitir uma melhor experiência por
          parte do utilizador. Ao navegar no site estará a consentir a sua
          utilização.
        </Paragraph>
        <Button
          marginLeft={20}
          marginTop={12}
          setSelect={handleSelect}
          onClick={() => handleSelect()}
        >
          Ok
        </Button>
      </Pane>
    </SideSheet>
  );
};

export default LGPD;

const Paragraph = styled.div`
  margin: 20px 0 0 50px;
  float: left;
`;
