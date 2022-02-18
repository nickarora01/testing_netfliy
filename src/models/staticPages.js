import { thunk, action } from "easy-peasy";
import { GetList } from "../services/staticPages";
import { get } from "lodash";
import history from "../utils/history";

const staticPages = {
  isLoading: false,
  error: "",
  item: {
    about: "",
    help: "",
    policy: "",
    returns: "",
    terms: ""
  },
  getList: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetList(payload);
      action.setItem(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setItem: action((state, payload) => {
    state.item = payload.results || {};
  }),
  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  })
};

export default staticPages;
