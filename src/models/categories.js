import { thunk, action } from "easy-peasy";
import { getAll, listCategories } from "../services/categories";
import { get } from "lodash";
import history from "../utils/history";

const categories = {
  isLoading: false,
  error: "",
  categories: [],
  categoriesList: [],
  //get all
  getAll: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await getAll();
      action.setModels(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setModels: action((state, payload) => {
    state.categories = payload?.results;
  }),
  //end get all

  //list
  list: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await listCategories();
      action.setCategoriesList(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setCategoriesList: action((state, payload) => {
    state.categoriesList = payload;
  }),
  //end list

  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  }),
};

export default categories;
