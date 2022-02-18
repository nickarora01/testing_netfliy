import React from "react";
import styled from "styled-components";
import {
  Box,
  Flex,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { Icon } from "evergreen-ui";

const ModalViewImage = (props) => {
  return (
    <Container key={Math.random()}>
      <Modal
        onClose={props.onClose}
        size={"780px"}
        isOpen={props.isOpen}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent maxHeight="700px">
          <CustomModalHeader
            justifyContent="space-between"
            height="40px"
            borderBottom={"1.5px solid #eee"}
          >
            <CrossIcon onClick={props.onClose} icon="cross" cursor="pointer" />
            {props.showDeleteButton && (
              <DeleteIcon
                onClick={props.deleteImage}
                icon="trash"
                cursor="pointer"
                marginLeft={"10px"}
              />
            )}
          </CustomModalHeader>
          <ModalBody margin="auto" flex="initial">
            <CustomImage src={props.src} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default ModalViewImage;

const Container = styled(Box)``;

const CustomImage = styled(Image)`
  max-width: 700px;
  max-height: 450px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    max-width: 600px;
    margin-top: -1rem;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    max-width: 300px;
    margin-top: -1rem;
  }
  @media (max-width: ${(props) => props.theme.queries.i5}) {
    max-width: 270px;
    margin-top: -1rem;
  }
`;

const CustomModalHeader = styled(ModalHeader)`
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
`;

//icon
const DeleteIcon = styled(Icon)`
  path {
    transition: 0.3s;
    fill: ${(props) => props.theme.color.red} !important;
  }
`;

const CrossIcon = styled(Icon)`
  height: 25px;
  width: 25px;
`;
