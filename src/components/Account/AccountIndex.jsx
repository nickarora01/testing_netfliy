import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { formatToDate } from "brazilian-values";
import {
  Box,
  Text,
  useDisclosure,
  ModalContent,
  ModalHeader,
  Modal,
  ModalOverlay,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { Table, Badge, RadioGroup } from "evergreen-ui";
import { createBrowserHistory } from "history";
import { withRouter } from "react-router-dom";
import { useStore, useActions } from "../../configureStore";
import { TableHead, TableRow } from "../../components/UI";
import { FormatToEuro } from "../../utils/helper";
import BecomeWorkerHome from "./BecomeWorkerHome";
import BecomeHomeAssistant from "./BecomeHomeAssistant";
import ContainerMakeAction from "./ContainerMakeAction";

const AccountIndex = (props) => {
  const history = createBrowserHistory({ forceRefresh: true });

  const [becomeUser, setBecomeUser] = useState(false);
  const [becomeUserType, setBecomeUserType] = useState("");
  const profile = useStore((state) => state.user.profile);
  const indicationCode = useStore((state) => state.user.indicationCode);
  const orders = useStore((state) => state.order.orders);
  const listOrders = useActions((state) => state.order.listOrders);
  const getIndicationCode = useActions((state) => state.user.getIndicationCode);
  const hideProfile = useActions((state) => state.user.hideProfile);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = React.useRef();
  const finalRef = React.useRef();
  const modalBodyRef = React.useRef();

  useEffect(() => {
    listOrders(0);
    getIndicationCode();
  }, []);

  return (
    <>
      <Constainer>
        {indicationCode &&
        profile?.user_info?.indication_accepted &&
        profile?.complete_register ? (
          <BoxCodeIndication>
            Seu Código para novas indicações: <b>{indicationCode.code}</b>
          </BoxCodeIndication>
        ) : null}
        {!profile?.user_premium && (
          <ContainerMakeAction
            title="Premium Usuário"
            description="Encontre o profissional que você precisa, torne-se um usuário premium."
            buttonText="Realizar Pagamento"
            onClick={() => (window.location.href = "/conta/usuario/pagamento")}
          />
        )}

        {!profile.trial &&
          (profile?.user_info?.type_work ||
            profile?.user_info?.type_home_assistent) &&
          !profile?.work_premium && (
            <ContainerMakeAction
              title="MANTENHA SEU PERFIL ATIVO, RENOVE AQUI"
              description="MANTENHA SEU PERFIL ATIVO, RENOVE AQUI"
              buttonText="Realizar Pagamento"
              onClick={() => {
                if (profile.user_info.type_work) {
                  window.location.href = "/conta/trabalhador/pagamento";
                  // history.push("/conta/trabalhador/pagamento");
                } else {
                  window.location.href = "/conta/homeassistant/pagamento";
                  // history.push("/conta/homeassistant/pagamento");
                }
              }}
            />
          )}

        {!profile?.user_info?.type_home_assistent && (
          <ContainerMakeAction
            title={"HomeAssistant"}
            description={"Torne-se um home assistant."}
            buttonText="Clique aqui"
            onClick={() => {
              setBecomeUser(false);
              setBecomeUserType("homeAssistant");
              onOpen();
            }}
          />
        )}
        {!profile?.user_info?.type_work && (
          <ContainerMakeAction
            title={"Trabalhador"}
            description={"Cadastre seu perfil profissional"}
            buttonText="Clique aqui"
            onClick={() => {
              setBecomeUser(false);
              setBecomeUserType("worker");
              onOpen();
            }}
          />
        )}

        <Box>
          <Label>Ocultar Perfil</Label>
          <CustomRadio
            name="hiddenProfile"
            value={profile?.user_info?.hidden?.toString()}
            options={[
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            onChange={(value) =>
              hideProfile({ hidden: value?.includes("true") })
            }
          />
        </Box>

        <CustomTable>
          <Text fontWeight={600} marginLeft={2} fontSize="1.2rem">
            Últimos pagamentos
          </Text>
          <TableHead
            labels={[
              { title: "Data" },
              { title: "Valor" },
              { title: "Tipo" },
              { title: "Status" },
            ]}
          />
          <Table.Body overflow="hidden">
            {orders?.length > 0 &&
              orders?.slice(0, 3)?.map((item, idx) => {
                return (
                  <TableRow
                    key={idx}
                    actions={false}
                    values={[
                      { value: formatToDate(new Date(item?.created_at)) },
                      { value: <b>{FormatToEuro(item?.total)}</b> },
                      {
                        value: (
                          <Badge color="neutral">
                            {item?.type === 1
                              ? "Usuário"
                              : item?.type === 2
                              ? "Trabalhador"
                              : "HomeAssistant"}
                          </Badge>
                        ),
                      },
                    ]}
                    status={item?.status}
                  />
                );
              })}
          </Table.Body>
        </CustomTable>
      </Constainer>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
        scrollBehavior="inside"
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          {becomeUser ? (
            <></>
          ) : becomeUserType === "worker" ? (
            <ModalHeader>Tornar-se Trabalhador</ModalHeader>
          ) : (
            <ModalHeader>Tornar-se Home Assistant</ModalHeader>
          )}

          <ModalCloseButton />
          <ModalBody pb={6} name="formModal" ref={modalBodyRef}>
            {becomeUserType === "user" ? (
              <></>
            ) : becomeUserType === "worker" ? (
              <>
                <span>
                  Preencha os campos abaixo e confirme para se tornar um
                  trabalhador
                </span>
                <BecomeWorkerHome
                  onClose={onClose}
                  modalBodyRef={modalBodyRef}
                  becomeUserType={becomeUserType}
                />
              </>
            ) : (
              <>
                <span>
                  Preencha os campos abaixo e confirme para se tornar um Home
                  Assistant
                </span>
                <BecomeWorkerHome
                  onClose={onClose}
                  modalBodyRef={modalBodyRef}
                  becomeUserType={becomeUserType}
                />
              </>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default withRouter(AccountIndex);

const Constainer = styled(Box)`
  padding: 0rem 1rem 1rem 1rem;
  border-radius: 0.3rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 300px;
    overflow: auto;
    padding: 17px 0 0 0;
  }
`;

const CustomTable = styled(Table)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 600px;
  }
`;

// make payment container

const ContaynerMakePayment = styled(Box)`
  position: relative;
  border: 1px solid #e4e7eb;
  border-radius: 0.3rem;
  padding: 1rem;
  margin-bottom: 4rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Label = styled.label`
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
`;

const BoxCodeIndication = styled.p`
  padding-bottom: 40px;
  font-size: 20px;
`;
