import { request } from "../utils/api";

export const getAll = (loadReview = false) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "categories/all",
  });
};

export const listCategories = (loadReview = false) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "categories",
  });
};
