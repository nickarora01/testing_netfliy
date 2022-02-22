import { request } from "../utils/api";

export const List = () => {
  return request({
    method: "get",
    baseUrl: "api",
    route: "users/chats",
  });
};

export const Get = (chatId) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `users/chats/${chatId}`,
  });
};

export const Create = (friendId) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: "chats",
    payload: {
      friend_id: friendId,
    },
  });
};

export const Delete = (chatId) => {
  return request({
    method: "delete",
    baseUrl: "api",
    route: `chats/${chatId}`,
  });
};

export const UpdateTime = (chatId) => {
  return request({
    method: "patch",
    baseUrl: "api",
    route: `chats/${chatId}/time`,
  });
};

export const ValidMessage = (word) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `blacklist/${word}`,
  });
};

//messages

export const GetMessage = (id) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `chats/${id}/chat_messages?sort=id-asc`,
  });
};

export const SendMessage = (id, payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `chats/${id}/chat_messages`,
    payload,
  });
};

export const DeleteMessage = (chatId, messageId) => {
  return request({
    method: "delete",
    baseUrl: "api",
    route: `chats/${chatId}/chat_messages/${messageId}`,
  });
};
