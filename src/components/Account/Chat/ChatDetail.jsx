import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import {
  Box,
  Heading,
  Flex,
  Avatar,
  Text,
  Image,
  Input,
  Button,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { Icon, Popover, Menu, Position } from "evergreen-ui";
import ModalAlertDelete from "./ModalAlertDelete";
import { useStore, useActions } from "../../../configureStore";
import { theme } from "../../../theme";
import { DeleteMessage } from "../../../services/chat";
import { Upload } from "../../../utils/upload";

import ModalViewImage from "./ModalViewImage";
import securityPdf from "../../../assets/pdf/security.pdf";
import { update } from "lodash";

const Message = (props) => {
  const chatId = useStore((state) => state.chat.chatId);
  const srcImage = useStore((state) => state.chat.srcImage);
  const updateTime = useActions((state) => state.chat.updateTime);
  const currentUser = useStore((state) => state.user.profile);
  const [showAlert, setShowAlert] = useState(false);
  const toaster = useToast();

  if (props.type === 2) {
    return (
      <MessageImage
        key={props.data?.id}
        display="flex"
        flexDirection="column"
        {...props}
      >
        <Image
          onClick={props.onOpen}
          loading="lazy"
          {...props}
          src={props.src}
        />
        {props?.data?.user?.id === currentUser?.id && (
          <BoxImageChevronDown className="chevron" bg={props.bg}>
            <Popover
              position={Position.BOTTOM_LEFT}
              content={
                <Menu>
                  <Menu.Group>
                    <Menu.Item
                      onSelect={() => {
                        setShowAlert(true);
                      }}
                    >
                      Excluir
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              }
            >
              <Icon marginTop=".5rem" icon="chevron-down" />
            </Popover>
          </BoxImageChevronDown>
        )}
        <Box
          marginTop="5px"
          marginLeft="10px"
          fontSize="12px"
          alignSelf="flex-end"
          marginBottom="1px"
          opacity=".8"
        >
          {format(new Date(props.time), "kk:mm")}
        </Box>
        <ModalViewImage
          src={srcImage}
          isOpen={props.isOpen}
          onClose={props.onClose}
          deleteImage={() => {
            setShowAlert(true);
          }}
          showDeleteButton={props?.data?.user?.id === currentUser?.id}
        />
        <ModalAlertDelete
          label={"Apagar imagem?"}
          type="message"
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          handleDelete={async () => {
            try {
              await DeleteMessage(chatId, props.data?.id);
              updateTime(chatId);
              toaster({
                title: "Imagem deletada com sucesso!",
                status: "success",
                duration: 3000,
                position: "top",
              });
              setShowAlert(false);
            } catch (error) {
              toaster({
                title: "Ocorreu um erro ao deletar a imagem, tente novamente!",
                status: "error",
                duration: 3000,
                position: "top",
              });
            }
          }}
        />
      </MessageImage>
    );
  } else if (props.type === 1) {
    return (
      <MessageItem {...props}>
        <Box width={"100%"}>{props.message}</Box>
        {props?.data?.user?.id === currentUser?.id && (
          <BoxChevronDown className="chevron" bg={props.bg}>
            <Popover
              position={Position.BOTTOM_LEFT}
              content={
                <Menu>
                  <Menu.Group>
                    <Menu.Item
                      onSelect={() => {
                        setShowAlert(true);
                      }}
                    >
                      Excluir
                    </Menu.Item>
                  </Menu.Group>
                </Menu>
              }
            >
              <Icon marginTop=".5rem" icon="chevron-down" />
            </Popover>
          </BoxChevronDown>
        )}
        <Box
          marginLeft="10px"
          fontSize="12px"
          alignSelf="flex-end"
          marginBottom="1px"
          opacity=".8"
        >
          {format(new Date(props.time), "kk:mm")}
        </Box>
        <ModalAlertDelete
          type="message"
          isOpen={showAlert}
          onClose={() => setShowAlert(false)}
          handleDelete={async () => {
            try {
              await DeleteMessage(chatId, props.data?.id);
              toaster({
                title: "Mensagem deletada com sucesso!",
                status: "success",
                duration: 3000,
                position: "top",
              });
              updateTime(chatId);
              setShowAlert(false);
            } catch (error) {
              toaster({
                title:
                  "Ocorreu um erro ao deletar a mensagem, tente novamente!",
                status: "error",
                duration: 3000,
                position: "top",
              });
            }
          }}
        />
      </MessageItem>
    );
  }
};

const DrawerLineContent = (props) => {
  return (
    <Flex
      {...props}
      marginBottom={"1rem"}
      alignItems="center"
      justifyContent="space-between"
    >
      <Text fontWeight={600} margin="0">
        {props.label}
      </Text>
      <Text margin="0">{props.value}</Text>
    </Flex>
  );
};

const ChatDetail = (props) => {
  //hook
  const toaster = useToast();

  //actions
  const deleteChat = useActions((state) => state.chat.delete);
  const setChatId = useActions((state) => state.chat.setChatId);
  const setChat = useActions((state) => state.chat.setChat);
  const setSrcImage = useActions((state) => state.chat.setSrcImage);
  const validAndSendMessage = useActions(
    (state) => state.chat.validAndSendMessage
  );
  const updateTime = useActions((state) => state.chat.updateTime);

  //state
  const chat = useStore((state) => state.chat.chat);
  const user = useStore((state) => state.user.profile);
  const chatId = useStore((state) => state.chat.chatId);
  const [showAlert, setShowAlert] = useState(false);
  const [isShow, setIsShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const [value, setValue] = useState("");
  const [showImage, setShowImage] = useState(false);
  let currentPhotoFile = null;
  const refInput = useRef(null);

  //scroll to last message
  useEffect(() => {
    const endRef = document.getElementById("endRef");
    if (endRef) {
      let containerHeight = endRef.clientHeight * 100000;
      setTimeout(() => (endRef.scrollTop = containerHeight), 1000);
    }
  }, []);

  useEffect(() => {
    const endRef = document.getElementById("endRef");
    if (endRef) {
      let containerHeight = endRef.clientHeight * 100000;
      setTimeout(() => (endRef.scrollTop = containerHeight), 100);
    }
  }, [props.loading, loading]);

  //scroll end

  const onChoosePhoto = (event) => {
    if (event.target.files && event.target.files[0]) {
      setLoading(true);
      currentPhotoFile = event.target.files[0];
      const prefixFiletype = event.target.files[0].type.toString(); // verifica se o tipo é imagem
      if (prefixFiletype.indexOf("image/") === 0) {
        uploadPhoto();
      } else {
        setLoading(false);
        toaster({
          title: "Ocorreu um erro!",
          description: "Esse arquivo não é uma imagem.",
          status: "error",
          duration: 5000,
          position: "top",
        });
      }
    } else {
      console.log("Erro ao escolher foto!");
      setLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (currentPhotoFile) {
      const filename = await Upload(`chats/${chatId}`, currentPhotoFile);
      onValidMessage({
        message: filename,
        image: filename,
        type: 2,
        chat_id: chat?.id,
      });
    } else {
      setLoading(false);
      toaster({
        title: "Ocorreu um erro!",
        description: `Arquivo inválido. Tente novamente!`,
        status: "error",
        duration: 5000,
        position: "top",
      });
    }
  };

  const onValidMessage = (data) => {
    validAndSendMessage(data);
    updateTime(chatId);
    setValue("");
  };

  return (
    <Box>
      {chatId === 0 ? (
        <EmptyContent>
          <Flex flexDirection="column" alignItems="center">
            <Text maxWidth={"290px"} textAlign="center" fontSize="1.1rem">
              Inicie uma conversa.
              <br /> Grandes coisas podem acontecer!
            </Text>
          </Flex>
        </EmptyContent>
      ) : (
        <Container>
          <Flex flexDirection="column">
            <Header>
              <Flex alignItems="center">
                {props.windowWidth <= 440 && (
                  <CustomIcon
                    size="20px"
                    onClick={() => props.setChatId(0)}
                    icon="arrow-left"
                    cursor="pointer"
                    marginRight={"7px"}
                  />
                )}
                {props.friend?.id === user?.id ? (
                  <>
                    <CustomAvatar
                      name={props.user?.name}
                      src={props.user?.image}
                    />
                    {props.windowWidth > 440 && (
                      <Text margin={"0 0 0 1rem"} fontWeight={600}>
                        {props.user?.name}
                      </Text>
                    )}
                  </>
                ) : (
                  <>
                    <CustomAvatar
                      name={props.friend?.name}
                      src={props.friend?.image}
                    />
                    {props.windowWidth > 440 && (
                      <Text margin={"0 0 0 1rem"} fontWeight={600}>
                        {props.friend?.name}
                      </Text>
                    )}
                  </>
                )}
              </Flex>
              <Flex alignItems="center">
                <SecurityPdf href={securityPdf} target="_blank">
                  Segurança
                </SecurityPdf>
                <CustomIcon
                  onClick={() =>
                    document.getElementById("viewInputGallery").click()
                  }
                  icon="paperclip"
                  cursor="pointer"
                  marginRight={"22px"}
                />
                <ViewInputGallery
                  ref={refInput}
                  accept="image/*"
                  id="viewInputGallery"
                  type="file"
                  onChange={onChoosePhoto}
                />
                <CustomIcon
                  onClick={() => setIsShow(!isShow)}
                  icon="person"
                  cursor="pointer"
                  marginRight={"10px"}
                />
                <DeleteIcon
                  onClick={() => setShowAlert(true)}
                  icon="trash"
                  cursor="pointer"
                  marginLeft={"10px"}
                />
              </Flex>
            </Header>
            <Drawer
              isOpen={isShow}
              placement="right"
              onClose={() => setIsShow(false)}
            >
              <DrawerOverlay />
              <DrawerContent>
                <CustomCloseDrawer />
                <DrawerHeader>{props.friend?.name}</DrawerHeader>
                <DrawerBody paddingTop={"2rem"}>
                  {/* <DrawerLineContent label="Profissão" value={"Test"} /> */}
                </DrawerBody>
              </DrawerContent>
            </Drawer>
          </Flex>
          <BoxMessages>
            <Box
              display="flex"
              flexDirection="column"
              padding="1rem"
              height="432px"
              overflowY="auto"
              id="endRef"
            >
              {!props.loading &&
                props.chat?.map((item, idx) => {
                  if (item?.chat?.friend_id === item?.user_id) {
                    return (
                      <Message
                        bg={theme.color.white}
                        type={item?.type}
                        key={idx}
                        backgroundColor="white"
                        alignSelf="flex-start"
                        message={item?.message}
                        src={`${process.env.REACT_APP_ASSETS_BUCKET}/chats/${item?.chat_id}/${item?.message}`}
                        isOpen={showImage}
                        onOpen={() => {
                          setSrcImage({
                            chat_id: item?.chat_id,
                            image: item?.message,
                          });
                          setShowImage(true);
                        }}
                        onClose={() => setShowImage(false)}
                        time={item?.created_at}
                        data={item}
                      />
                    );
                  } else {
                    return (
                      <Message
                        type={item?.type}
                        key={idx}
                        backgroundColor="#DBF8C6"
                        alignSelf="flex-end"
                        message={item?.message}
                        time={item?.created_at}
                        isOpen={showImage}
                        src={`${process.env.REACT_APP_ASSETS_BUCKET}/chats/${item?.chat_id}/${item?.message}`}
                        data={item}
                        onOpen={() => {
                          setSrcImage({
                            chat_id: item?.chat_id,
                            image: item?.message,
                          });
                          setShowImage(true);
                        }}
                        onClose={() => setShowImage(false)}
                      />
                    );
                  }
                })}
            </Box>
            <BoxSendMessage>
              <CustomInput
                marginRight="10px"
                type="text"
                placeholder="Digite uma mensagem"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === "Enter" && value?.length > 0) {
                    onValidMessage({
                      message: value,
                      type: 1,
                      chat_id: chat?.id,
                    });
                  }
                }}
              />
              <Button
                cursor="pointer"
                color={theme.color.white}
                backgroundColor={theme.color.green}
                border="none"
                onClick={() => {
                  if (value?.length > 0) {
                    onValidMessage({
                      message: value,
                      type: 1,
                      chat_id: chat?.id,
                    });
                  }
                }}
                _hover={{ backgroundColor: theme.color.green, opacity: 0.7 }}
                _focus={{ backgroundColor: theme.color.green, opacity: 0.7 }}
              >
                Enviar
              </Button>
            </BoxSendMessage>
          </BoxMessages>
        </Container>
      )}
      <ModalAlertDelete
        isOpen={showAlert}
        onClose={() => setShowAlert(false)}
        handleDelete={() => {
          setShowAlert(false);
          deleteChat(chat?.id);
          setChatId(0);
          setChat({});
        }}
        username={chat?.friend?.name}
      />
    </Box>
  );
};

export default ChatDetail;

const Container = styled(Box)``;

const Header = styled(Flex)`
  padding: 0 1rem;
  align-items: center;
  justify-content: space-between;
  background-color: #f6f6f6;
  min-height: 65px;
`;

const CustomAvatar = styled(Avatar)`
  height: 49px;
  width: 49px;
  background-color: ${(props) => props.theme.color.green} !important;
  color: ${(props) => props.theme.color.white} !important;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    height: 29px !important;
    width: 29px !important;
    font-size: 0.8rem !important;
  }
`;

const BoxMessages = styled(Flex)`
  height: 100%;
  max-height: 538px;
  flex-direction: column;
  justify-content: space-between;
  background-color: #efece8;
`;

const BoxSendMessage = styled(Flex)`
  padding: 0 1rem;
  height: 70px;
  background-color: #f6f6f6;
  align-items: center;
`;

const CustomInput = styled(Input)`
  width: 100% !important;
  border: 1px solid #eee !important;
  border-radius: 4rem !important;
  ::placeholder {
    font-size: 0.9rem;
  }
`;

const CustomIcon = styled(Icon)`
  :hover,
  :focus {
    opacity: 0.8;
  }
`;

const DeleteIcon = styled(Icon)`
  :hover,
  :focus {
    path {
      transition: 0.3s;
      fill: ${(props) => props.theme.color.red} !important;
    }
    opacity: 0.8;
  }
`;

const SecurityPdf = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: #525f7f;
  font-size: 1rem;
  margin-right: 1rem;
  transition: all 0.3s;
  &:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    font-size: 0.9rem;
  }
`;

//Message
const MessageItem = styled(Box)`
  position: relative;
  display: flex;
  justify-content: space-between;
  min-width: 130px;
  max-width: 45%;
  display: flex;
  padding: 0.5rem;
  border-radius: 0.3rem;
  margin-bottom: 1rem;
  box-shadow: 0 1px 0.5px rgba(0, 0, 0, 0.13);

  :hover {
    .chevron {
      transition: 0.5s;
      opacity: 0.8;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    max-width: 90%;
  }
`;

const MessageImage = styled(Box)`
  position: relative;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  min-width: 200px;
  max-height: 310px;
  margin-bottom: 1rem;
  box-shadow: 0.5px 1px 1px rgba(0, 0, 0, 0.13);
  border-radius: 0.3rem;
  img {
    cursor: pointer;
    margin: 0 auto;
    max-width: 290px;
    max-height: 290px;
  }

  :hover {
    .chevron {
      transition: 0.5s;
      opacity: 1;
    }
  }
`;

const ViewInputGallery = styled.input`
  opacity: 0;
  position: absolute;
  z-index: -1;
  left: 10px;
  width: 30px;
`;

const BoxChevronDown = styled(Box)`
  position: absolute;
  height: 100%;
  z-index: 10;
  width: 30px;
  top: 0px;
  right: 0;
  background-color: ${(props) =>
    props.bg !== undefined ? props.bg : "#DBF8C6"};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
`;

const BoxImageChevronDown = styled(Box)`
  position: absolute;
  border-radius: 10px;
  height: 30px;
  z-index: 10;
  width: 30px;
  top: 0px;
  right: 0;
  background-color: ${(props) =>
    props.bg !== undefined ? props.bg : "#DBF8C6"};
  display: flex;
  align-items: flex-start;
  justify-content: center;
  opacity: 0;
  cursor: pointer;
`;

//Drawer
const CustomCloseDrawer = styled(DrawerCloseButton)`
  cursor: pointer;
  border: none !important;
  background-color: transparent !important;
  top: 15px !important;
  right: 10px !important;
  svg {
    height: 15px !important;
    width: 15px !important;
  }
`;

//empty id

const EmptyContent = styled(Box)`
  height: 99%;
  background-color: ${(props) => props.theme.color.white};
  display: flex;
  align-items: center;
  justify-content: center;
`;
