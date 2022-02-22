import { thunk, action } from "easy-peasy";
import {
  GetMe,
  UpdateProfile,
  EditProfilePassword,
  SendEmail,
  GetProfile,
  UpdateUserInfo,
  UpdateUserAddress,
  UpdateUserAvailable,
  UpdateUserLanguage,
  SendIndication,
  HideUser,
  GetIndicationCode,
} from "../services/user";
import { get } from "lodash";
import { toaster } from "evergreen-ui";
import history from "../utils/history";

const user = {
  isLoading: false,
  error: "",
  user: {},
  profile: {},
  indicationCode: null,
  getMe: thunk(async (action, payload) => {
    try {
      const response = await GetMe();
      if (response.status > 399) {
        toaster.danger("Ocorreu um erro, faça o login novamente.", {
          duration: 5,
          id: "error-me",
        });
        localStorage.removeItem("4you_auth");
        window.location.href = "/";
      } else {
        action.setModel(response.data.results);
      }
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  getIndicationCode: thunk(async (action, payload) => {
    try {
      const response = await GetIndicationCode();
      action.setIndicationCode(response.data.results);
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  getProfile: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await GetProfile();
      if (response.status > 399) {
        toaster.danger("Ocorreu um erro, faça o login novamente.", {
          duration: 5,
          id: "error-me",
        });
        localStorage.removeItem("4you_auth");
        window.location.href = "/";
        action.setLoading({ loading: false });
      } else {
        action.setProfile(response.data);
        action.setLoading({ loading: false });
      }
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
      action.setLoading({ loading: false });
    }
  }),
  hideProfile: thunk(async (action, payload) => {
    try {
      await HideUser(payload);
      action.getProfile();
      history.push("/conta?tab=1");
      toaster.success("Seus dados foram atualizados com sucesso!");
    } catch (error) {
      let message = "falha em requisitar o servidor.";
      if (error.response) {
        const { status, data } = Object.assign({}, error).response;
        if (status > 399) message = get(data, "message");

        if (message.includes("idx_users_email"))
          message = "E-mail já é utilizado por outro usuário.";
      }
      toaster.danger(message);
      action.setError({ message });
      action.setLoading({ loading: false });
    }
  }),
  updateProfile: thunk(async (action, payload) => {
    try {
      await UpdateProfile(payload.profile);
      await UpdateUserInfo(payload.user_info);
      await UpdateUserAddress(payload.address);
      await UpdateUserAvailable(payload.available);
      await UpdateUserLanguage(payload.user_language);
      if (payload.profile?.indication_code) {
        await SendIndication(payload.profile.indication_code);
      }

      action.getProfile();
      history.push("/conta?tab=1");
      toaster.success("Seus dados foram atualizados com sucesso!");
    } catch (error) {
      let message = "falha em requisitar o servidor.";
      if (error.response) {
        const { status, data } = Object.assign({}, error).response;
        if (status > 399) message = get(data, "message");

        if (message.includes("idx_users_email"))
          message = "E-mail já é utilizado por outro usuário.";
      }
      toaster.danger(message);
      action.setError({ message });
      action.setLoading({ loading: false });
    }
  }),
  // updateUserInfo: thunk(async (action, payload) => {
  //   try {
  //     await UpdateUserInfo(payload);
  //   } catch (error) {
  //     console.log(error?.message)
  //     action.setError({ message: "Error" });
  //   }
  // }),
  sendEmail: thunk(async (action, payload) => {
    try {
      await SendEmail(payload);
      toaster.success("Enviado com sucesso!");
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  editProfilePassword: thunk(async (action, payload) => {
    try {
      await EditProfilePassword(payload);
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  setModel: action((state, payload) => {
    state.user = payload;
  }),
  setProfile: action((state, payload) => {
    state.profile = payload?.results;
  }),
  setIndicationCode: action((state, payload) => {
    state.indicationCode = payload;
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

export default user;
