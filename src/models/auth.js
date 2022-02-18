import { thunk, action } from "easy-peasy";
import {
  login,
  signup,
  change,
  forgot,
  loginFacebook,
  signupWizard,
  updateWizard,
} from "../services/auth";
import history from "../utils/history";
import { get, updateWith } from "lodash";
import { toaster } from "evergreen-ui";
import { format } from "date-fns";
import { checkLocalStorage, setInLocalStorage } from "../utils/localstorage";
import { GetMe, SendIndication, UpdateUserLanguage } from "../services/user";

// rehydrate the auth state from localStorage if it exist
export const initialState = checkLocalStorage("4you_auth", {
  token: null,
  isAuthenticated: false,
});

const auth = {
  ...initialState,
  isAuthLoading: false,
  authError: "",
  isSuccess: false,
  authenticateUser: thunk(async (action, payload) => {
    action.updateIsAuthLoading({ loading: true });
    try {
      const response = await login(payload);
      action.updateAuth(response.data);
      action.updateIsAuthLoading({ loading: false });
      if (response.data?.results?.complete_register) history.push("/conta");
      else history.push(`/cadastro/wizard?s=${2}`);
    } catch (error) {
      if (error.response) {
        action.updateIsAuthLoading({ loading: false });
        if (error.response.data.message?.includes("not found")) {
          action.updateAuthError({
            message: "Usuário não registrado.",
          });
        } else if (error.response.data.message) {
          action.updateAuthError({
            message: error.response.data.message,
          });
        } else {
          action.updateAuthError({
            message: "Nome ou senha incorretos",
          });
        }
      } else {
        // generic error
        action.updateIsAuthLoading({ loading: false });
        action.updateAuthError({
          message: "Nome ou senha incorretos.",
        });
      }
    }
  }),
  authenticateFacebook: thunk(async (action, payload) => {
    action.updateIsAuthLoading({ loading: true });
    try {
      const response = await loginFacebook(payload);
      action.updateAuth(response.data);
      action.updateIsAuthLoading({ loading: false });
      history.push("/conta");
    } catch (error) {
      if (error.response) {
        action.updateIsAuthLoading({ loading: false });
        if (error.response.data.message) {
          action.updateAuthError({
            message: error.response.data.message,
          });
        } else {
          action.updateAuthError({
            message: error.response.data.status,
          });
        }
      } else {
        // generic error
        action.updateIsAuthLoading({ loading: false });
        action.updateAuthError({
          message: "Username or password incorrect.",
        });
      }
    }
  }),
  saveUser: thunk(async (action, { payload, id, step, edit }) => {
    action.updateIsAuthLoading({ loading: true });
    action.setIsSuccess(false);
    try {
      let res = {};
      if (!id) res = await signupWizard(payload, step);
      else res = await updateWizard(payload, id, step);

      if (res?.data?.results) {
        if (!id && step === 1) {
          const authResponse = await login({
            email: payload.email,
            password: payload.password,
          });
          action.updateAuth(authResponse.data);
        }

        if (payload?.user_language)
          await UpdateUserLanguage(payload.user_language);
        if (payload?.indication_code && !res?.data?.results?.user_indication_id)
          await SendIndication(payload.indication_code);

        setTimeout(async () => {
          if (
            (payload?.user_info?.type_user && step == 1) ||
            ((payload?.user_info?.type_work ||
              payload?.user_info?.type_home_assistent) &&
              step == 5)
          ) {
            history.push("/conta");
            window.scrollTo(0, 0);
          }
          action.setIsSuccess(true);
        }, 500);
      }

      action.updateIsAuthLoading({ loading: false });
      action.updateAuthError({ message: "" });
      if (!edit) {
        if (payload?.user_info?.type_user && step == 1) {
          toaster.success(
            "Você ganhou 1 hora de trial para conhecer nosso website.",
            {
              duration: 6,
              id: "trial-me",
            }
          );
        } else if (step == 5) {
          if (
            payload?.user_info?.type_work ||
            payload?.user_info?.type_home_assistent
          ) {
            toaster.success(
              "Você ganhou 3 meses de trial para conhecer nosso website.",
              {
                duration: 6,
                id: "trial-me",
              }
            );
          } else {
            toaster.success(
              "Você ganhou um trial para conhecer nosso website.",
              {
                duration: 6,
                id: "trial-me",
              }
            );
          }
        }
      } else {
        toaster.success("Alteração realizado com sucesso", {
          duration: 6,
          id: "trial-me",
        });
      }

      window.scrollTo(0, 0);
    } catch (error) {
      if (error.response) {
        window.scrollTo(0, 0);
        if (error.response.data.message.includes("email: already used")) {
          action.updateAuthError({
            message: "E-mail já esta cadastrado.",
          });
        } else if (
          error.response.data.message?.includes("does not validate as email")
        ) {
          action.updateAuthError({
            message: "E-mail inválido",
          });
        } else if (error.response.data.message.includes("cpf")) {
          action.updateAuthError({
            message: "Este NIF já esta cadastrado.",
          });
        } else if (error.response.data.message.includes("rg")) {
          action.updateAuthError({
            message: "Essa identidade já esta cadastrado.",
          });
        } else if (error.response.data.message.includes("Indication code")) {
          action.updateAuthError({
            message: "Código de indicação não encontrado",
          });
        } else {
          action.updateAuthError({
            message: "Ocorreu um erro, tente novamente.",
          });
        }
      } else {
        action.updateAuthError({
          message: "Ocorreu um erro, tente novamente.",
        });
        toaster.danger("Ocorreu um erro, tente novamente.", {
          duration: 5,
          id: "error-me",
        });
      }
      action.setIsSuccess(false);
      action.updateIsAuthLoading({ loading: false });
      window.scrollTo(0, 0);
    }
  }),
  createUser: thunk(async (action, payload) => {
    action.updateIsAuthLoading({ loading: true });
    try {
      const res = await signup(payload);
      if (res?.data?.results) {
        setTimeout(async () => {
          const authResponse = await login({
            email: payload.email,
            password: payload.password,
          });
          action.updateAuth(authResponse.data);
          history.push("/conta");
          window.scrollTo(0, 0);
        }, 500);
      }
      action.updateIsAuthLoading({ loading: false });
      if (payload?.user_info?.type_user) {
        toaster.success(
          "Você ganhou 1 hora de trial para conhecer nosso website.",
          {
            duration: 6,
            id: "trial-me",
          }
        );
      } else if (
        payload?.user_info?.type_work ||
        payload?.user_info?.type_home_assistent
      ) {
        toaster.success(
          "Você ganhou 3 meses de trial para conhecer nosso website.",
          {
            duration: 6,
            id: "trial-me",
          }
        );
      } else {
        toaster.success("Você ganhou um trial para conhecer nosso website.", {
          duration: 6,
          id: "trial-me",
        });
      }

      window.scrollTo(0, 0);
    } catch (error) {
      if (error.response) {
        window.scrollTo(0, 0);
        if (error.response.data.message.includes("email: already used")) {
          action.updateAuthError({
            message: "E-mail já esta cadastrado.",
          });
        } else if (
          error.response.data.message?.includes("does not validate as email")
        ) {
          action.updateAuthError({
            message: "E-mail inválido",
          });
        } else if (error.response.data.message.includes("cpf")) {
          action.updateAuthError({
            message: "Este NIF já esta cadastrado.",
          });
        } else if (error.response.data.message.includes("rg")) {
          action.updateAuthError({
            message: "Essa identidade já esta cadastrado.",
          });
        } else if (error.response.data.message.includes("Indication code")) {
          action.updateAuthError({
            message: "Código de indicação não encontrado",
          });
        } else {
          action.updateAuthError({
            message: "Ocorreu um erro, tente novamente.",
          });
        }
      } else {
        action.updateAuthError({
          message: "Ocorreu um erro, tente novamente.",
        });
        toaster.danger("Ocorreu um erro, tente novamente.", {
          duration: 5,
          id: "error-me",
        });
      }
      action.updateIsAuthLoading({ loading: false });
      window.scrollTo(0, 0);
    }
  }),
  getMe: thunk(async (action, payload) => {
    const response = await GetMe(payload);
    if (response.status > 399) {
      toaster.danger("Ocorreu um erro, tente novamente.", {
        duration: 5,
        id: "error-me",
      });
      localStorage.removeItem("4you_auth");
      window.location.href = "/";
    } else {
      action.updateSession(response.data.results);
    }
  }),
  forgotPassword: thunk(async (action, payload) => {
    action.updateIsAuthLoading({ loading: true });
    try {
      await forgot(payload);
      action.updateIsAuthLoading({ loading: false });
      action.setMsgForgot(
        "Nós enviamos o email com o link para redefinir a senha"
      );
    } catch (error) {
      action.updateIsAuthLoading({ loading: false });
      action.updateAuthError({
        message: "Email não encontrado.",
      });
    }
  }),
  changePassword: thunk(async (action, payload) => {
    action.updateIsAuthLoading({ loading: true });
    try {
      await change(payload);
      action.updateIsAuthLoading({ loading: false });
      toaster.success("Atualizado com sucesso.", {
        duration: 3,
        id: "change-password-user",
      });

      history.push("/conta");
    } catch (error) {
      action.updateIsAuthLoading({ loading: false });
      action.updateAuthError({
        message: "Token inválido.",
      });
    }
  }),
  updateSession: action((state, payload) => {
    const auth = JSON.parse(localStorage.getItem("4you_auth"));
    setInLocalStorage("4you_auth", {
      isAuthenticated: auth.isAuthenticated,
      token: auth.token,
      user: payload,
    });

    state.user = payload;
    if (!payload.complete_register)
      window.location.href = `/cadastro/wizard?s=${2}`;
  }),
  updateAuth: action((state, payload) => {
    const token = get(payload, "token", "");
    const user = get(payload, "results", "");
    const isAuthenticated = true;

    // store the auth state offline
    setInLocalStorage("4you_auth", {
      isAuthenticated,
      token,
      user,
    });

    window.Tawk_API &&
      window.Tawk_API.setAttributes(
        {
          id: user?.id,
          name: user?.name,
          email: user?.email,
        },
        (error) => {
          console.log(error);
        }
      );

    state.isAuthenticated = isAuthenticated;
    state.token = token;
    state.user = user;
  }),
  updateIsAuthLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isAuthLoading = loading;
  }),
  updateAuthError: action((state, payload) => {
    const errorMessage = get(payload, "message", "");
    state.authError = errorMessage;
  }),
  setMsgForgot: action((state, payload) => {
    state.msgForgot = payload;
  }),
  setIsSuccess: action((state, payload) => {
    state.isSuccess = payload;
  }),
  clearAuth: action((state) => {
    localStorage.removeItem("4you_auth");
    state.token = initialState.token;
    state.isAuthenticated = initialState.isAuthenticated;
    window.location.href = "/";
  }),
};

export default auth;
