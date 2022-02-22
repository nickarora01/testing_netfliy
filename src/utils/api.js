import axios from "axios";
import history from "./history";
import get from "lodash/get";
import { toaster } from "evergreen-ui";
import { auth as useAuth } from "../hooks/auth";
import { ignorePages } from "./helper";

export const api = axios.create({
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    "X-4U": "Website",
  },
  timeout: 20000,
});

export const apiPure = axios.create({
  timeout: 20000,
});

api.interceptors.request.use(
  function (config) {
    const { auth, cachedAuth } = useAuth(false);
    const isAuth =
      !!get(auth, "token", false) || !!get(cachedAuth, "token", false);

    if (ignorePages(config.url)) {
      delete config.headers.Authorization;
    } else {
      if (isAuth) {
        const token =
          get(auth, "token", false) || get(cachedAuth, "token", false);
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        if (isAuth) {
          config.headers.Authorization = `Bearer ${get(auth, "token", false)}`;
        } else {
          // if (!ignorePages(config.url)) {
          //   history.push("/entrar");
          // }
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  function (response) {
    return response;
  },
  (error) => {
    if (error.response) {
      if (error.response.status === 401 || error.response.status === 403) {
        if (!ignorePages(window.location.pathname)) {
          toaster.danger("Faça login para continuar", {
            duration: 5,
            id: "login-continue",
          });
          localStorage.removeItem("4you_auth");
          // history.push("/entrar");
        }
      }

      if (error.response.status === 402) {
        toaster.warning(
          "Você precisa compra um dos nossos planos para entrar em contato com estes profissionais",
          { id: "plan-me" }
        );
      }
    } else {
      if (!ignorePages(window.location.pathname)) {
        // localStorage.removeItem("4you_auth");
        // window.location.href = "/entrar";
      }
    }
    return Promise.reject(error);
  }
);

export const request = async (req) => {
  return api({
    url: `${process.env.REACT_APP_BASE_URL}/${req.baseUrl}/${req.route}`,
    data: req.payload || null,
    method: req.method,
  });
};
