import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Box } from "@chakra-ui/react";
import Select from "react-select";
import { Popover, Pane, IconButton } from "evergreen-ui";
import queryString from "query-string";
import { useFormik } from "formik";
import { withRouter } from "react-router-dom";
import AsyncSelect from "react-select/async";
import { useStore, useActions } from "../../../configureStore";
import citiesJson from "../../../json/portugal_cities.json";

const AddressModal = (props) => {
  //querystring
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
  const queryHomeAssistant = query.home_assistant || false;

  //store
  const isLoading = useStore((state) => state.categories.isLoading);
  const categories = useStore((state) => state.categories.categories);
  const [defaultOpt, setDefaultOpt] = useState();

  //actions
  const getAll = useActions((action) => action.categories.getAll);

  //state
  const [cities, setCities] = useState([]);
  const [countryDefaultOpt, setCountryDefaultOpt] = useState();
  const [cityDefaultOpt, setCityDefaultOpt] = useState();

  const contries = [
    {
      value: "portugal",
      label: "Portugal",
    },
  ];

  const getContextsForSelectCity = (input) => {
    const result = citiesJson.map((item) => {
      if (item.country === input) {
        return { label: item.city, value: item.city };
      }
    });

    return result;
  };

  const getContextsForSelectCountry = async () => {
    return contries;
  };

  useEffect(() => {
    if (queryCountry?.length > 0) {
      setCities(getContextsForSelectCity(queryCountry));
    }
  }, [queryCountry]);

  //get searched countries
  useEffect(() => {
    let country = contries.find((z) => {
      if (z.value === queryCountry) {
        return {
          label: z.name,
          value: z.id,
        };
      }
    });
    setCountryDefaultOpt(country);
  }, [isLoading]);

  //get searched city
  useEffect(() => {
    if (cities?.length > 0) {
      let city = cities.find((z, idx) => {
        if (z?.label === queryCity) {
          return {
            label: z?.label,
            value: idx + 1,
          };
        }
      });
      setCityDefaultOpt(city);
    }
  }, [cities]);

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

  const validate = (values) => {
    const err = {};
    const message = "Campo obrigatório";

    if (values.categories?.length === 0) err.min = message;
    return err;
  };

  const formik = useFormik({
    initialValues: {
      country: queryCountry || "",
      city: "",
      state: "",
      street: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      props.history.replace({
        pathname: "/profissionais",
        search: `?start=${queryOffset}&categories=${values?.categories?.join(
          ","
        )}&price_min=${queryPriceMin}&price_max=${queryPriceMax}&language=${queryLanguage}&city=${
          values.city || queryCity
        }&country=${
          values.country || queryCountry
        }&pageNumber=${queryPageNumber}&gender=${queryGender}&text=${queryText}&distance=${queryDistance}`,
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
          height={"auto"}
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
          {!isLoading && (
            <AsyncSelect
              name="country"
              placeholder="Selecione um país..."
              styles={{
                container: (base) => ({
                  width: "100%",
                  marginBottom: "1rem",
                }),
                control: (base) => ({
                  ...base,
                }),
                menu: (base) => ({
                  ...base,
                  zIndex: 10,
                  width: "300px",
                  height: "85px",
                  marginTop: "-310px",
                  marginLeft: "-7px",
                }),
                menuList: (base) => ({
                  ...base,
                }),
              }}
              onChange={(e) => {
                setCities(getContextsForSelectCity(e.value));
                formik.setFieldValue("country", e.value);
              }}
              loadOptions={(e) => getContextsForSelectCountry(e)}
              cacheOptions
              defaultValue={countryDefaultOpt}
              defaultOptions
            />
          )}
          {!isLoading && (
            <Select
              isDisabled={cities?.length === 0}
              name="state"
              placeholder="Selecione um Distrito..."
              styles={{
                container: (base) => ({
                  width: "100%",
                  marginBottom: "1rem",
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
                  height: "200px",
                  marginTop: "-240px",
                  marginLeft: "-7px",
                }),
                menuList: (base) => ({
                  ...base,
                  minHeight: "fit-content",
                  height: "200px",
                }),
              }}
              onChange={(e) => {
                formik.setFieldValue("state", e.value);
              }}
              defaultValue={cityDefaultOpt}
              options={cities}
            />
          )}
          {!isLoading && (
            <Select
              isDisabled={formik.values.state?.length === 0}
              name="city"
              placeholder="Selecione um distrito..."
              styles={{
                container: (base) => ({
                  width: "100%",
                  marginBottom: "1rem",
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
                  height: "200px",
                  marginTop: "-310px",
                  marginLeft: "-7px",
                }),
                menuList: (base) => ({
                  ...base,
                  minHeight: "fit-content",
                  height: "200px",
                }),
              }}
              onChange={(e) => {
                formik.setFieldValue("city", e.value);
              }}
              defaultValue={cityDefaultOpt}
              options={cities}
            />
          )}
          {!isLoading && (
            <Select
              isDisabled={formik.values.city?.length === 0}
              name="street"
              placeholder="Selecione uma rua..."
              styles={{
                container: (base) => ({
                  width: "100%",
                  marginBottom: "1rem",
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
                  marginTop: "-310px",
                  height: "200px",
                  marginLeft: "-7px",
                }),
                menuList: (base) => ({
                  ...base,
                  minHeight: "fit-content",
                  height: "200px",
                }),
              }}
              onChange={(e) => {
                formik.setFieldValue("street", e.value);
              }}
              defaultValue={cityDefaultOpt}
              options={cities}
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

export default withRouter(AddressModal);

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
