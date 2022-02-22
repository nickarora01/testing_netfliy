import { request } from "../utils/api";

export const ListBanner = () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "banners"
  });
};
