import { thunk, action } from "easy-peasy";
import {
  GetOrder,
  ListOrders,
  GetOrderSeller,
  GetOrderSellerTotal,
  GetSubscription,
} from "../services/order";
import { get } from "lodash";

const order = {
  isLoading: false,
  error: "",
  orderSellerTotal: 0,
  order: {},
  count: 0,
  orders: [],
  orderSeller: [],
  subscription: null,
  getOrder: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetOrder(payload);
      action.setModel(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  listOrders: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await ListOrders(payload);
      action.setModels(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  GetOrderSeller: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetOrderSeller(payload);
      action.setOrderSeller(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  getOrderSellerTotal: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetOrderSellerTotal();
      action.setOrderSellerTotal(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  getSubscription: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetSubscription();
      action.setSubscription(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: error?.message });
      action.setLoading({ loading: false });
    }
  }),
  setSubscription: action((state, payload) => {
    state.subscription = payload;
  }),
  setOrderSeller: action((state, payload) => {
    state.orderSeller = payload || [];
  }),
  setOrderSellerTotal: action((state, payload) => {
    state.orderSellerTotal = payload.results || [];
  }),
  setModel: action((state, payload) => {
    state.order = payload.results || {};
  }),
  setModels: action((state, payload) => {
    state.orders = payload.results || [];
    state.count = payload.ct || 0;
  }),
  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  }),
};

export default order;
