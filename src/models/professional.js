import { thunk, action } from "easy-peasy";
import { list, get as getPro } from "../services/professional";
import { get } from "lodash";
import { toaster } from "evergreen-ui";
import history from "../utils/history";

const professional = {
  isLoading: false,
  error: "",
  professional: {},
  ct: 0,
  professionals: [],
  listProfessionals: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await list(payload);
      action.setProfessionals(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  setProfessionals: action((state, payload) => {
    const res = get(payload, "results", []);
    const ct = get(payload, "ct", 0);
    state.professionals = res;
    state.ct = ct;
  }),
  getProfessional: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await getPro(payload);
      action.setProfessional(response.data);
      action.setLoading({ loading: false });
    } catch (error) {
      if (error.response?.data?.message?.includes("Payment Required")) {
        toaster.warning(
          "Faça pagamento para continuar vendo todas as funcionalidades.",
          {
            duration: 6,
            id: "error-payment",
          }
        );
        history.push("/conta");
      }
      action.setLoading({ loading: false });
    }
  }),
  setProfessional: action((state, payload) => {
    const res = get(payload, "results", {});
    state.professional = res;
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

export default professional;
