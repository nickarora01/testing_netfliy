import { Box, Button, Input, Textarea } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { theme } from "../../theme";

const MyButton = (props) => {
  const {
    click,
    description,
    iconBefore,
    iconAfter,
    className,
    type = "submit",
    disabled,
  } = props;
  return (
    <Button
      disabled={disabled}
      className={className}
      type={type}
      height="45px"
      textTransform="uppercase"
      color="white"
      fontSize="1rem"
      backgroundColor={theme.color.green}
      border="none"
      cursor="pointer"
      _hover={{
        backgroundColor: theme.color.green,
        opacity: 0.8,
      }}
      _focus={{
        backgroundColor: theme.color.green,
        opacity: 0.8,
      }}
      onClick={click}
    >
      {!!iconBefore && iconBefore}
      {description}
      {!!iconAfter && iconAfter}
    </Button>
  );
};

export default MyButton;
