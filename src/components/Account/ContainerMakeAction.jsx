import React from "react";
import styled from "styled-components";
import { Box, Button, Badge, Flex, Text } from "@chakra-ui/react";
import { withRouter } from "react-router-dom";

import { theme } from "../../theme";

const ContainerMakeAction = (props) => {
  return (
    <Container>
      <Badge
        color="neutral"
        marginRight={8}
        position="absolute"
        top={"-17px"}
        left={0}
      >
        {props.title}
      </Badge>
      <Flex>
        <Text fontWeight={500}>{props.description}</Text>
      </Flex>
      <Flex justifyContent="flex-end">
        <Button
          onClick={props.onClick}
          color={theme.color.white}
          backgroundColor={theme.color.green}
          border="none"
          cursor="pointer"
          _hover={{
            backgroundColor: theme.color.green,
            opacity: 0.7,
          }}
        >
          {props.buttonText}
        </Button>
      </Flex>
    </Container>
  );
};

export default withRouter(ContainerMakeAction);

const Container = styled(Box)`
  position: relative;
  border: 1px solid #e4e7eb;
  border-radius: 0.3rem;
  padding: 1rem;
  margin-bottom: 4rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
  > div:nth-child(2) {
    width: 50%;
  }
  > div:nth-child(3) {
    width: 40%;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    flex-direction: column;
    > div:nth-child(2),
    > div:nth-child(3) {
      width: 100%;
    }
  }
`;
