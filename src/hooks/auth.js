import { useStoreState as store } from "easy-peasy";
import { initialState } from "../models/auth";

export const auth = (withHook = true) => {
  const authStorage = localStorage.getItem("4you_auth");
  let auth;
  if (withHook) {
    auth = store((state) => state.auth);
  }
  // @ts-ignore
  const cachedAuth = JSON.parse(authStorage) || {
    auth: initialState,
  };
  return {
    auth,
    cachedAuth,
  };
};
