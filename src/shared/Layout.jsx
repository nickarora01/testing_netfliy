import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { get } from "lodash";
import { IntlProvider, addLocaleData } from "react-intl";
import locale_pt from "react-intl/locale-data/pt";
import locale_en from "react-intl/locale-data/en";

import lang_en from "../translations/en.json";
import { auth as useAuth } from "../hooks/auth";
import { useActions } from "../configureStore";

import Navbar from "./Navbar";
import Footer from "./Footer";
import LGPD from "./LGPD";

export const Layout = (props) => {
  addLocaleData([...locale_pt, ...locale_en]);

  const messages = {
    pt: null,
    en: lang_en,
  };

  const locales = {
    pt: "pt",
    en: "en",
  };

  const [select, setSelect] = useState(
    window.localStorage.getItem("lang") || locales.pt
  );

  const handleSelect = (select) => {
    setSelect(select);
    window.localStorage.setItem("lang", select);
  };

  const { auth, cachedAuth } = useAuth(true);
  const getMe = useActions((actions) => actions.auth.getMe);
  const getProfile = useActions((actions) => actions.user.getProfile);

  const isAuth =
    (!!get(auth, "token", false) || !!get(cachedAuth, "token", false)) &&
    !window.location.pathname.includes("entrar") &&
    !window.location.pathname.includes("cadastro") &&
    !window.location.pathname.includes("trocar-senha");

  useEffect(() => {
    if (isAuth) {
      getProfile();
      getMe();
    }
  }, [window.location.pathname]);

  return (
    <IntlProvider messages={messages[select]} locale={locales.en}>
      <Grid>
        <GridHeader>
          <Navbar
            icon={"menu"}
            setSelect={handleSelect}
            locales={locales}
            selected={select}
          />
        </GridHeader>
        <GridContent>{props.children}</GridContent>
        <Footer />
        <LGPD />
      </Grid>
    </IntlProvider>
  );
};

const Grid = styled.div`
  height: 100%;
`;

const GridHeader = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${(props) => props.theme.color.white};
`;

const GridContent = styled.div`
  overflow: auto;
  overflow-x: hidden;
`;
