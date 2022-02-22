import React, { useEffect } from "react";
import styled from "styled-components";
import { Grid } from "@chakra-ui/react";
import useWindowSize from "../../../hooks/useWIndowSize";
import useInterval from "../../../hooks/useInterval";
import { useStore, useActions } from "../../../configureStore";

import ListChat from "./ListChat";
import ChatDetail from "./ChatDetail";

const GridChat = (props) => {
  //actions
  const setChatId = useActions((action) => action.chat.setChatId);
  const getChat = useActions((action) => action.chat.get);
  const getMessages = useActions((state) => state.chat.getMessages);

  //states
  const loading = useStore((state) => state.chat.loadingSend);
  const chatId = useStore((state) => state.chat.chatId);
  const currentChat = useStore((state) => state.chat.chat);
  const messages = useStore((state) => state.chat.messages);

  const { width } = useWindowSize();

  useEffect(() => {
    if (chatId > 0) {
      getMessages(chatId);
      getChat(chatId);
    }
  }, [chatId, loading]);

  useInterval(() => {
    if (chatId > 0) {
      getMessages(chatId);
    }
    return;
  }, 5000);

  if (width > 440) {
    return (
      <Container>
        <ListChat />
        <ChatDetail
          chat={messages}
          windowWidth={width}
          friend={currentChat?.friend}
          user={currentChat?.user}
        />
      </Container>
    );
  } else if (width <= 440) {
    return (
      <Container>
        {chatId === 0 && <ListChat />}
        {chatId > 0 && (
          <ChatDetail
            chat={messages}
            setChatId={setChatId}
            windowWidth={width}
            friend={currentChat?.friend}
            user={currentChat?.user}
          />
        )}
      </Container>
    );
  }
};

export default GridChat;

const Container = styled(Grid)`
  grid-template-columns: 30% 70%;
  border: 1px solid #e4e7eb;
  border-radius: 0.3rem;
  height: 600px;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: 1fr;
  }
`;
