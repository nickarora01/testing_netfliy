import { createBrowserHistory } from "history";
import { toQueryParams } from "./http";

const history = createBrowserHistory();
const shove = history.push;

history.push = (params) => {
  if (typeof params === "string") {
    window.scrollTo(0, 0);
    shove(params);
  } else {
    const { query } = params;
    shove({
      ...params,
      search: toQueryParams(query || {}),
    });
    window.scrollTo(0, 0);
  }
};

export default history;
