import { thunk, action } from "easy-peasy";
import {
  CreateOrderCapture,
  GetOrderTransaction,
  CreateOrder,
  CreateInvoice,
  PaypalActiveSubscription,
} from "../services/order";
import { GetProfile } from "../services/user";
import { get } from "lodash";
import history from "../utils/history";

const payment = {
  isLoading: false,
  updateLoading: false,
  error: "",
  payed: false,
  checkout: {},

  //START
  getCheckoutTransaction: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetOrderTransaction(payload);
      action.setModel(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setModel: action((state, payload) => {
    state.checkout = payload.results || {};
  }),
  //END

  //START
  createCheckout: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const user = await GetProfile();

      await CreateOrder({
        total: parseFloat(payload.total),
        type: payload.orderType,
        method: 1,
        status: 2,
        transaction_id: payload.orderId,
        user_id: user?.data?.results?.id,
        label: payload.productDescription,
      });

      await CreateOrderCapture(payload.orderId);

      await CreateInvoice({
        product: {
          ref: payload.productCode,
          designation: payload.productDescription,
          short_name: payload.productDescription,
          tax: payload.iva,
          short_descrition: payload.productDescription,
          long_descrition: payload.productDescription,
          price: payload.productValue,
        },
        ref: payload.orderId,
        tax: payload.iva,
        qt: 1,
        discount: payload.discount,
        price: parseFloat(payload.total),
      });

      if (payload.orderType === 1) {
        history.push(`/conta/usuario/pagamento/sucesso?id=${payload.orderId}`);
      } else if (payload.orderType === 2 || payload.orderType === 3) {
        history.push(
          `/conta/trabalhador/pagamento/sucesso?id=${payload.orderId}`
        );
      }

      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  //END

  //START
  activeSubscription: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const res = await PaypalActiveSubscription(payload);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  //END

  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  }),
};

export default payment;
