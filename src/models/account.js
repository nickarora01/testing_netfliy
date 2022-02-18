import { thunk, action, actionOn } from "easy-peasy";
import { get } from "lodash";
import history from "../utils/history";
import { arrayToObjectString } from "../utils/helper";
import { CreateProduct, UpdateProduct } from "../services/account";

const account = {
  isLoading: false,
  error: "",
  setProduct: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      await CreateProduct(payload);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setLoading({ loading: false });
      action.setError({ message: "Error on create" });
    }
  }),
  updateProduct: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      await UpdateProduct(payload.id, payload.model);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setLoading({ loading: false });
      action.setError({ message: "Error on create" });
    }
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  }),
  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  })
};

export default account;
