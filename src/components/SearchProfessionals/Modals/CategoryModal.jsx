import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { uniqBy } from "lodash";
import { Button } from "@chakra-ui/react";
import { Popover, Pane, IconButton } from "evergreen-ui";
import queryString from "query-string";
import { useFormik } from "formik";
import { withRouter } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { useStore, useActions } from "../../../configureStore";

const CategoryModal = (props) => {
  //state
  const isLoading = useStore((state) => state.categories.isLoading);
  const categories = useStore((state) => state.categories.categories);
  const [defaultOpt, setDefaultOpt] = useState();

  //actions
  const getAll = useActions((action) => action.categories.getAll);

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    let arr = [];

    let newObj = queryCategories?.split(",")?.map((item) => {
      categories.find((z) => {
        if (z.id === parseInt(item)) {
          arr.push({
            label: z.name,
            value: z.id,
          });
        }
      });
    });

    setDefaultOpt(arr);
  }, [isLoading]);

  const getContextsForSelectCategory = async (input) => {
    const result = categories.filter((item) =>
      item?.name?.toLowerCase()?.includes(input.toLowerCase())
    );
    const data = result?.map((item) => {
      return { label: item.name, value: item.id };
    });

    return uniqBy(data, "label");
  };

  const query = queryString.parse(props.location.search);
  const queryOffset = parseInt(query.start) || "";
  const queryPageNumber = parseInt(query.pageNumber) || "";
  const queryCategories = query.categories || "";
  const queryPriceMin = parseInt(query.price_min) || "";
  const queryPriceMax = parseInt(query.price_max) || "";
  const queryLanguage = query.language || "";
  const queryGender = query.gender || "";
  const queryText = query.text || "";
  const queryCountry = query.country || "";
  const queryCity = query.city || "";
  const queryDistance = parseFloat(query.distance) || "";
  const queryLat = parseFloat(query.lat) || "";
  const queryLng = parseFloat(query.lng) || "";
  const queryHomeAssistant = query.home_assistant || false;

  const validate = (values) => {
    const err = {};
    const message = "Campo obrigatório";

    if (values.categories?.length === 0) err.min = message;
    return err;
  };

  const formik = useFormik({
    initialValues: {
      categories: [],
    },
    onSubmit: (values, { setSubmitting }) => {
      props.history.replace({
        pathname: "/profissionais",
        search: `?start=${queryOffset}&categories=${values?.categories?.join(
          ","
        )}&price_min=${queryPriceMin}&price_max=${queryPriceMax}&language=${queryLanguage}&city=${queryCity}&country=${queryCountry}&pageNumber=${queryPageNumber}&gender=${queryGender}&text=${queryText}&distance=${queryDistance}&lat=${queryLat}&lng=${queryLng}`,
        state: { some: "state" },
      });

      window.scrollTo(0, 0);
      setSubmitting(false);
      // props.onClose();
    },
    validate,
  });

  return (
    <Popover
      content={({ close }) => (
        <Pane
          padding={20}
          width={320}
          height={220}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Pane height={50} display="flex" alignSelf="flex-end">
            <CustomClose
              icon="cross"
              onClick={close}
              appearance="minimal"
              iconSize={18}
            />
          </Pane>
          {!isLoading && categories?.length > 0 && (
            <AsyncSelect
              name="categories"
              placeholder="Selecione uma profissão..."
              styles={{
                container: (base) => ({
                  width: "100%",
                }),
                singleValue: (base) => ({
                  ...base,
                  padding: 5,
                  borderRadius: 5,
                  background: "gray",
                  color: "white",
                  display: "flex",
                }),
                control: (base) => ({
                  ...base,
                  height: "54px",
                  "min-height": "34px",
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 10,
                  width: "300px",
                  height: "85px",
                  marginTop: "-90px",
                  marginLeft: "-7px",
                  // minHeight: "fit-content",
                }),
                menuList: () => ({
                  height: "85px",
                  overflow: "auto",
                }),
              }}
              isMulti
              onChange={(e) => {
                if (e) {
                  let result = e.map((item) => item.value);
                  formik.setFieldValue("categories", result);
                }
              }}
              defaultValue={defaultOpt}
              loadOptions={(e) => getContextsForSelectCategory(e)}
              cacheOptions
              defaultOptions
            />
          )}
          <Pane display="flex" alignSelf="flex-end" marginTop={30}>
            <BtnSave
              onClick={() => {
                formik.submitForm();
                close();
              }}
            >
              Salvar
            </BtnSave>
          </Pane>
        </Pane>
      )}
    >
      {props.children}
    </Popover>
  );
};

export default withRouter(CategoryModal);

const BtnSave = styled(Button)`
  background-color: ${(props) => props.theme.color.green} !important;
  color: ${(props) => props.theme.color.white} !important;
  border: none;
  cursor: pointer;
  :hover,
  :focus {
    opacity: 0.8;
  }
`;

const CustomClose = styled(IconButton)`
  cursor: pointer !important;
  width: 100%;
`;
