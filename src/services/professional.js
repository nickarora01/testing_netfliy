import { request } from "../utils/api";

export const list = (payload) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: `professionals?limit=20&${payload}`,
  });
};

export const get = (id) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: `professionals/${id}`,
  });
};
