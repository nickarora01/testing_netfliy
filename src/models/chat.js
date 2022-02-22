import { thunk, action } from "easy-peasy";
import {
  Create,
  Get,
  List,
  Delete,
  UpdateTime,
  ValidMessage,
  SendMessage,
  GetMessage,
} from "../services/chat";
import { get } from "lodash";
import { toaster } from "evergreen-ui";

const chat = {
  isLoading: false,
  updateLoading: false,
  loadingSend: false,
  error: "",
  chatId: 0,
  srcImage: ``,
  chats: [],
  messages: [],
  chat: {},

  //create chat BEGIN
  create: thunk(async (action, payload) => {
    try {
      action.setUpdateLoading({ loading: true });
      await Create(payload);
      action.setUpdateLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setUpdateLoading({ loading: false });
    }
  }),
  //create chat END

  //list chats BEGIN
  list: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await List();
      action.setChats(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setChats: action((state, payload) => {
    state.chats = payload.results;
  }),
  //list chats END

  //get chat BEGIN
  get: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await Get(payload);
      action.setChat(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setChat: action((state, payload) => {
    state.chat = payload.results;
  }),
  //get chat END

  //get messages
  getMessages: thunk(async (action, payload) => {
    try {
      const res = await GetMessage(payload);
      action.setMessage(res.data);
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  setMessage: action((state, payload) => {
    state.messages = payload.results;
  }),
  //end

  //delete chat BEGIN
  delete: thunk(async (action, payload) => {
    try {
      action.setUpdateLoading({ loading: true });
      await Delete(payload);
      action.setUpdateLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setUpdateLoading({ loading: false });
    }
  }),
  //delete chat END

  //update chat time BEGIN
  updateTime: thunk(async (action, payload) => {
    try {
      action.setUpdateLoading({ loading: true });
      await UpdateTime(payload);
      action.setUpdateLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setUpdateLoading({ loading: false });
    }
  }),

  setUpdateLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.updateLoading = loading;
  }),
  //update chat time END

  //valid and send message
  validAndSendMessage: thunk(async (action, payload) => {
    try {
      const res = await ValidMessage(payload?.message);
      if (res.data?.valid) {
        toaster.danger(`Não é permitido o uso da palavra "${res.data?.word}"`);
      } else {
        action.setLoadingSend({ loading: true });
        await SendMessage(payload?.chat_id, payload);
        action.setLoadingSend({ loading: false });
      }
    } catch (error) {
      action.setError({ message: "Error" });
      toaster.danger("Ocorreu um erro ao enviar a mensagem, tente novamente!");
    }
  }),

  //end

  setChatId: action((state, payload) => {
    state.chatId = payload;
  }),
  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  }),
  setLoadingSend: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.loadingSend = loading;
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  }),
  setSrcImage: action((state, payload) => {
    state.srcImage = `${process.env.REACT_APP_ASSETS_BUCKET}/chats/${payload?.chat_id}/${payload?.image}`;
  }),
};

export default chat;
