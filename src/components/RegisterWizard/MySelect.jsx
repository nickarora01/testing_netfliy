import { Box, Input, Textarea } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import ReactSelect from "react-select";

const MySelect = (props) => {
  const { label, labelForced, err, widthBox, maxlength = "48" } = props;

  const toTitleCase = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    } else {
      return "";
    }
  };
  const title = labelForced || toTitleCase(label);

  return (
    <Box width={widthBox ?? "inherit"}>
      {title && <Label>{title}</Label>}
      <CustomSelect
        maxlength={maxlength}
        {...props}
        onInputChange={(inputValue) =>
          inputValue.length <= maxlength
            ? inputValue
            : inputValue.substr(0, maxlength)
        }
      />
      {err && <MessageError>{err}</MessageError>}
    </Box>
  );
};

export default MySelect;

const Label = styled.label`
  margin-right: 5px;
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;

const CustomSelect = styled(ReactSelect)``;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;
