import { request } from "../utils/api";

export const CreateProduct = (payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `products`,
    payload,
  });
};

export const UpdateProduct = (id, payload) => {
  return request({
    method: "put",
    baseUrl: "api",
    route: `products/${id}`,
    payload,
  });
};
