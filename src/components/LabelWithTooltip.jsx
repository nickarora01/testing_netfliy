import React from "react";
import styled from "styled-components";
import { Tooltip, InfoSignIcon } from "evergreen-ui";

export default function LabelWithTooltip({ label, infoMessage }) {
  return (
    <ContainerInput>
      <Label>{label}</Label>
      {infoMessage && (
        <Tooltip content={infoMessage}>
          <IconInfo />
        </Tooltip>
      )}
    </ContainerInput>
  );
}

const ContainerInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const IconInfo = styled(InfoSignIcon)`
  margin-left: 10px;
`;

const Label = styled.label`
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;
