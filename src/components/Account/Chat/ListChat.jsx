import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  InputGroup,
  InputRightElement,
  Input,
  Flex,
  Icon,
  Box,
  Button,
  useToast,
} from "@chakra-ui/react";
import { withRouter } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { removeAccents } from "../../../utils/helper";
import { useStore, useActions } from "../../../configureStore";
import { theme } from "../../../theme";
import securityPdf from "../../../assets/pdf/security.pdf";
import ModalAlertDelete from "./ModalAlertDelete";

//Components
import ChatItem from "./ChatItem";

const ListChat = (props) => {
  //actions
  const setChatId = useActions((state) => state.chat.setChatId);
  const listChats = useActions((state) => state.chat.list);

  //states
  const chatId = useStore((state) => state.chat.chatId);
  const chats = useStore((state) => state.chat.chats);
  const user = useStore((state) => state.user.profile);
  const loading = useStore((state) => state.chat.updateLoading);
  const [search, setSearch] = useState("");

  useEffect(() => {
    listChats();
  }, [chatId, loading]);

  const getContextsForSelectCategory = async () => {
    const result = chats.filter((item) =>
      removeAccents(item?.friend?.name?.toLowerCase())?.includes(
        removeAccents(search?.toLowerCase())
      )
    );
    const data = result?.map((item) => {
      return { label: item?.friend?.name, id: item?.id };
    });
    return data;
  };

  return (
    <Container flexDirection="column">
      <Header>
        <LinkDicasSeguranca href={securityPdf} target="_blank">
          Dicas de segurança
        </LinkDicasSeguranca>
        <MySelect
          name="categories"
          placeholder="Procurar usuário..."
          loadOptions={(e) => getContextsForSelectCategory()}
          inputValue={search}
          onInputChange={(value) => setSearch(value)}
          onChange={(e) => {
            setChatId(e?.id);
            setSearch(null);
          }}
          noOptionsMessage={() => "Nenhum usuário encontrado..."}
        />
      </Header>

      <WrapUsers>
        {chats?.length === 0 ? (
          <Flex
            height={"100%"}
            alignItems="center"
            justifyContent="center"
            flexDirection="column"
          >
            <Box>Você não possui conversas</Box>
            <Button
              marginTop={5}
              border="none "
              backgroundColor={theme.color.green}
              color={theme.color.white}
              cursor="pointer"
              _hover={{
                backgroundColor: theme.color.green,
                opacity: 0.8,
              }}
              onClick={() => props.history.push("/profissionais")}
            >
              Procurar Profissionais
            </Button>
          </Flex>
        ) : (
          <>
            {chats?.map((item, idx) => {
              if (item?.friend?.id === user?.id) {
                return (
                  <>
                    <ChatItem
                      active={item?.id === chatId}
                      onSelect={() => {
                        setChatId(item?.id);
                      }}
                      idx={idx}
                      name={item?.user?.name}
                      src={item?.user?.image}
                    />
                  </>
                );
              } else {
                return (
                  <>
                    <ChatItem
                      active={item?.id === chatId}
                      onSelect={() => {
                        setChatId(item?.id);
                      }}
                      idx={idx}
                      name={item?.friend?.name}
                      src={item?.friend?.image}
                    />
                  </>
                );
              }
            })}
          </>
        )}
      </WrapUsers>
    </Container>
  );
};

export default withRouter(ListChat);

const Container = styled(Flex)`
  border-right: 1px solid #e4e7eb;
`;

const Header = styled(Flex)`
  display: flex;
  flex-direction: column;
  padding-left: 20px;
  padding-top: 10px;
  background-color: #f6f6f6;
  height: 95px;

  .css-1hb7zxy-IndicatorsContainer {
    display: none;
  }
  .css-g1d714-ValueContainer {
    height: 40px;
    border-radius: 1rem;
  }
  .css-1uccc91-singleValue {
    opacity: 0.5;
  }
`;

const CustomInput = styled(Input)`
  width: 100% !important;
  border: 1px solid #eee !important;
  border-radius: 4rem !important;
  ::placeholder {
    font-size: 0.9rem;
  }
`;

const WrapUsers = styled(Box)`
  height: 538px;
  overflow-y: auto;
`;

const MySelect = styled(AsyncSelect)`
  width: 90%;
  height: 40px !important;
`;

const LinkDicasSeguranca = styled.a`
  color: black;
  font-size: 1rem;
  line-height: 2rem;
  margin-bottom: 0.3rem;
  text-decoration: none;

  &:hover {
    opacity: 0.6;
  }
`;
