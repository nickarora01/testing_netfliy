import { request } from "../utils/api";

export const GetMe = (loadReview = false) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: "users/me",
  });
};

export const HideUser = async (payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `users/hide`,
    payload,
  });
};

export const GetProfile = (loadReview = false) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: "users/profile",
  });
};

export const ValidPermission = () => {
  return request({
    method: "get",
    baseUrl: "api",
    route: "users/permission",
  });
};

export const UpdateProfile = async (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: "users",
    payload,
  });
};

export const UpdateUserInfo = async (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: "users/user_info",
    payload,
  });
};

export const UpdateUserAddress = async (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: "users/address",
    payload,
  });
};

export const UpdateUserLanguage = async (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: "users/language",
    payload,
  });
};

export const UpdateUserAvailable = async (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: "users/available",
    payload,
  });
};

export const SendIndication = async (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: `users/indication?indication_code=${payload}`,
  });
};

export const EditProfilePassword = (payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: "users/password",
    payload,
  });
};

export const SendEmail = (payload) => {
  return request({
    method: "post",
    baseUrl: "public",
    route: "send_email",
    payload,
  });
};

export const GetIndicationCode = () => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `users/user_indications`,
  });
};
