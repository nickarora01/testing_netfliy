import { request } from "../utils/api";

export const GetList = () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: `statics`,
  });
};

export const IndicationConfirm = (from_email, to_email) => {
  return request({
    method: "post",
    baseUrl: "public",
    route: `indications/confirm?from_email=${from_email}&to_email=${to_email}`,
  });
};
