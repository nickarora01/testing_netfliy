import { thunk, action } from "easy-peasy";
import { ListBanner } from "../services/banner";
import { get } from "lodash";

const banner = {
  isLoading: false,
  error: "",
  banners: [],
  getBanners: thunk(async action => {
    try {
      action.setLoading({ loading: true });
      const response = await ListBanner();
      action.setModel(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setModel: action((state, payload) => {
    state.banners = payload.results || [];
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

export default banner;
