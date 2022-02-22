import { request } from "../utils/api";

export const ListOrders = (start) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `users/orders?limit=12&start=${start}`,
  });
};

export const GetOrder = (id) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `orders/${id}`,
  });
};

export const GetOrderTransaction = (id) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `orders/transactions/${id}`,
  });
};

export const CreateOrder = (payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `orders`,
    payload,
  });
};

export const CreateOrderCapture = (payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `users/paypal/${payload}/capture`,
    payload,
  });
};

export const CreateInvoice = (payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `invoice`,
    payload,
  });
};

export const GetOrderSeller = (payload) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `users/product_sells?paid=${payload.st}`,
    payload,
  });
};

export const GetOrderSellerTotal = (payload) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `users/product_sells/total`,
    payload,
  });
};

export const PaypalActiveSubscription = (payload) => {
  return request({
    method: "post",
    baseUrl: "api",
    route: `users/paypal/subscription/${payload.id}?reason=${payload.reason}`,
  });
};

export const GetSubscription = (payload) => {
  return request({
    method: "get",
    baseUrl: "api",
    route: `users/subscription`,
  });
};
