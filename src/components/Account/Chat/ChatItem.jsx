import React from "react";
import styled from "styled-components";
import { Avatar, Flex, Text, Box, Icon } from "@chakra-ui/react";

const ChatItem = (props) => {
  return (
    <Content
      key={props.key}
      alignItems="center"
      onClick={props.onSelect}
      active={props.active}
    >
      <CustomAvatar name={props.name} src={props.src} />
      <Text margin={"0 0 0 1rem"} fontWeight={600}>
        {props.name}
      </Text>
    </Content>
  );
};

export default ChatItem;

const Content = styled(Flex)`
  transition: 0.3s;
  cursor: pointer;
  height: 70px;
  border-bottom: 1px solid #eee;
  padding: 0 0.5rem;
  background-color: ${(props) =>
    props.active === true ? `whitesmoke` : props.theme.color.white};
  :hover,
  :focus {
    background-color: whitesmoke;
    .actions {
      opacity: 1;
    }
  }
`;

const CustomAvatar = styled(Avatar)`
  height: 49px;
  width: 49px;
  background-color: ${(props) => props.theme.color.green} !important;
  color: ${(props) => props.theme.color.white} !important;
`;
