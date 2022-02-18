import React from "react";
import { Box } from "@chakra-ui/react";
import { RadioGroup } from "evergreen-ui";
import styled from "styled-components";

import LabelWithTooltip from "../LabelWithTooltip";

const MyRadio = (props) => {
  const { myLabel, labelForced } = props;

  const toTitleCase = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    } else {
      return "";
    }
  };

  const title = labelForced || toTitleCase(myLabel);

  return (
    <Box display="flex" flexDirection="column">
      {title && (
        <LabelWithTooltip label={title} infoMessage={props.infoMessage} />
      )}
      <CustomRadio {...props} />
    </Box>
  );
};

export default MyRadio;

const Label = styled.label`
  margin-right: 5px;
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;

const CustomRadio = styled(RadioGroup)`
  min-width: 200px;
  height: 50px;
  display: flex;
  align-items: center;
  label > span {
    font-size: 1.1rem !important;
  }
  label:nth-child(2) {
    margin-left: 1rem;
  }
  label:nth-child(3) {
    margin-left: 1rem;
  }

  .css-1bkiqpw:checked + div {
    background-image: linear-gradient(to bottom, #8cc73d, #8cc73d);
  }

  .css-1bkiqpw:checked + div {
    background-image: linear-gradient(to bottom, #8cc73d, #8cc73d);
  }

  .css-1bkiqpw:checked:hover + div {
    background-image: linear-gradient(to bottom, #8cc73d, #8cc73d);
  }
`;
