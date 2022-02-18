import React from "react";
import ReactDOM from "react-dom";
import { StoreProvider } from "easy-peasy";
import { ThemeProvider as NewThemeProvider } from "styled-components";
import { ThemeProvider, theme as themeChakra } from "@chakra-ui/react";
import store from "./configureStore";
import { GlobalStyle } from "./configureStyle";
import { theme } from "./theme";
import Routes from "./routes/index";
import history from "./utils/history";

const themeChak = {
  ...themeChakra,
  ...{
    fonts: {
      heading: `OpenSans, Arial, sans-serif`,
      body: `OpenSans, Arial, sans-serif`,
      mono: `OpenSans, Arial, sans-serif`,
    },
  },
};

ReactDOM.render(
  <>
    <NewThemeProvider theme={theme}>
      <ThemeProvider theme={themeChak}>
        <StoreProvider store={store}>
          <GlobalStyle />
          <Routes history={history} />
        </StoreProvider>
      </ThemeProvider>
    </NewThemeProvider>
  </>,
  document.getElementById("root")
);

if (process.env.NODE_ENV !== "production") {
  if (module.hot) {
    module.hot.accept();
  }
}
