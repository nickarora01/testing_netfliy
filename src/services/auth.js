import { request } from "../utils/api";

export const login = ({ email, password }) => {
  return request({
    method: "post",
    baseUrl: "public",
    route: "signin",
    payload: {
      email,
      password,
    },
  });
};

export const loginFacebook = (payload) => {
  return request({
    method: "post",
    baseUrl: "public",
    route: "auth/facebook",
    payload,
  });
};

export const signup = (payload) => {
  return request({
    method: "post",
    baseUrl: "public",
    route: "signup",
    payload,
  });
};

export const signupWizard = (payload, step) => {
  return request({
    method: "post",
    baseUrl: "public",
    route: `signup/wizard/${step}`,
    payload,
  });
};

export const updateWizard = (payload, id, step) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: `signup/wizard/${id}/${step}`,
    payload,
  });
};

export const forgot = ({ email }) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: `recover/${email}`,
  });
};

export const change = (payload) => {
  return request({
    method: "put",
    baseUrl: "public",
    route: "change_password",
    payload,
  });
};

export const ListCities = async () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "pais",
  });
};
