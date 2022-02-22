import { Box, Input, Textarea } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Tooltip, InfoSignIcon } from "evergreen-ui";
import useWindowSize from "../../hooks/useWIndowSize";
import _ from "lodash";

const MyInput = (props) => {
  const { width } = useWindowSize();

  const {
    label,
    labelForced,
    area,
    placeholderTemplate,
    err,
    maxlength = "255",
  } = props;

  const toFirstUp = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  const toTitleCase = (str) => {
    if (str) {
      return str.charAt(0).toUpperCase() + str.substr(1).toLowerCase();
    } else {
      return "";
    }
  };
  const title = labelForced || toTitleCase(label);
  const placeholder = placeholderTemplate
    ? `${toFirstUp(placeholderTemplate)} ${title}`
    : props.placeholder || "";

  return (
    <Box>
      {title && (
        <ContainerInput>
          <Label>{title}</Label>
          {props.infoMessage && (
            <Tooltip content={props.infoMessage}>
              <IconInfo />
            </Tooltip>
          )}
        </ContainerInput>
      )}
      {area ? (
        <CustomTextArea
          placeholder={placeholder}
          maxlength={maxlength}
          {...props}
        />
      ) : (
        <CustomInput
          placeholder={placeholder}
          maxlength={maxlength}
          {...props}
        />
      )}
      {err && <MessageError>{err}</MessageError>}
    </Box>
  );
};

export default MyInput;

const Label = styled.label`
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;

const CustomTextArea = styled(Textarea)`
  width: calc(100% - 32px) !important;
  border: 2px solid #eee !important;
  height: 45px !important;
  :disabled {
    opacity: 0.8 !important;
  }
`;

const CustomInput = styled(Input)`
  width: calc(100% - 32px) !important;
  border: 2px solid #eee !important;
  height: 45px !important;
  :disabled {
    opacity: 0.8 !important;
  }
`;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

const ContainerInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const IconInfo = styled(InfoSignIcon)`
  margin-left: 10px;
`;
