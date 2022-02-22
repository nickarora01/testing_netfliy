import React from "react";
import styled from "styled-components";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";

const ModalAlertDelete = (props) => {
  return (
    <AlertDialog isOpen={props.isOpen} onClose={props.onClose}>
      <AlertDialogOverlay />
      <AlertDialogContent>
        {props.type === "message" ? (
          <>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {props.label?.length > 0 ? props.label : `Apagar mensagem?`}
            </AlertDialogHeader>
          </>
        ) : (
          <>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Apagar conversa
            </AlertDialogHeader>

            <AlertDialogBody>
              Deseja apagar a conversa com "<b>{props.username}</b>"?
            </AlertDialogBody>
          </>
        )}

        <AlertDialogFooter>
          <CancelButton onClick={props.onClose}>Cancelar</CancelButton>
          <DeleteButton variantColor="red" onClick={props.handleDelete} ml={3}>
            Apagar
          </DeleteButton>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ModalAlertDelete;

const CancelButton = styled(Button)`
  border: none;
  background-color: white !important;
  color: gray;
  cursor: pointer;
`;

const DeleteButton = styled(Button)`
  border: none;
  cursor: pointer;
`;
