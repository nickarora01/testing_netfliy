import React from "react";
import styled from "styled-components";
import {
  Flex,
  Heading,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { withRouter } from "react-router-dom";
import { theme } from "../../../theme";

const EmptyModal = (props) => {
  return (
    <Modal isCentered={true} onClose={props.onClose} isOpen={props.isOpen}>
      <ModalOverlay />
      <ModalContent maxHeight="300px">
        <ModalHeader height="40px">
          <CustomCloseModal />
        </ModalHeader>
        <ModalBody>
          <Heading as="h3" margin="0" paddingBottom=".2rem" fontSize="1.5rem">
            Cadastre-se ou faça login
          </Heading>
          <Text margin={0}>
            Cadastre-se ou faça login para ter acesso ao conteúdo completo.
          </Text>
        </ModalBody>
        <ModalFooter>
          <Button
            cursor="pointer"
            border="none"
            backgroundColor={theme.color.green}
            color="white"
            onClick={() => {
              window.scrollTo(0, 0);
              props.history.push("/cadastro");
            }}
            _hover={{
              backgroundColor: theme.color.green,
              opacity: 0.7,
            }}
            _focus={{
              backgroundColor: theme.color.green,
              opacity: 0.7,
            }}
          >
            Cadastre-se
          </Button>
          <Button
            cursor="pointer"
            border="none"
            marginLeft={15}
            backgroundColor={theme.color.green}
            color="white"
            onClick={() => {
              window.scrollTo(0, 0);
              props.history.push("/entrar");
            }}
            _hover={{
              backgroundColor: theme.color.green,
              opacity: 0.7,
            }}
            _focus={{
              backgroundColor: theme.color.green,
              opacity: 0.7,
            }}
          >
            Entrar
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default withRouter(EmptyModal);

const CustomCloseModal = styled(ModalCloseButton)`
  cursor: pointer;
  border: none !important;
  background-color: transparent !important;
  top: 20px !important;
  right: 20px !important;
  left: 20px !important;
  svg {
    height: 15px !important;
    width: 15px !important;
  }
`;
