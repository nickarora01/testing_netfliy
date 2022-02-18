import React from "react";
import styled from "styled-components";
import { Input, Button } from "@chakra-ui/react";
import { Popover, IconButton, Pane, Label } from "evergreen-ui";
import queryString from "query-string";
import { useFormik } from "formik";
import { withRouter } from "react-router-dom";

const PriceMinMax = (props) => {
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

  const validate = (values) => {
    const err = {};
    if (values.min < 0) err.min = "Valor minimo deve ser maior ou igual a 0";
    if (values.max <= 0) err.max = "Valor máximo deve ser maior do que 0";
    if (values.max < values.min)
      err.max = "Valor máximo deve ser maior do que o valor minimo!";
    return err;
  };

  const formik = useFormik({
    initialValues: {
      min: queryPriceMin || "",
      max: queryPriceMax || "",
    },
    onSubmit: (values, { setSubmitting }) => {
      props.history.replace({
        pathname: "/profissionais",
        search: `?start=${queryOffset}&categories=${queryCategories}&price_min=${values.min}&price_max=${values.max}&language=${queryLanguage}&city=${queryCity}&country=${queryCountry}&pageNumber=${queryPageNumber}&gender=${queryGender}&text=${queryText}&distance=${queryDistance}&lat=${queryLat}&lng=${queryLng}`,
        state: { some: "state" },
      });

      window.scrollTo(0, 0);
      setSubmitting(false);
    },
    validate,
  });

  return (
    <Popover
      content={({ close }) => (
        <Pane
          padding={20}
          width={320}
          height={250}
          display="flex"
          flexDirection="column"
          alignItems="center"
        >
          <Pane height="50px" display="flex" alignSelf="flex-end">
            <CustomClose
              icon="cross"
              onClick={close}
              appearance="minimal"
              iconSize={18}
            />
          </Pane>
          {formik.errors.min ? (
            <Pane marginBottom="1rem" color="red" fontSize=".9rem">
              {formik.errors.min}
            </Pane>
          ) : (
            <Pane marginBottom="1rem" color="red" fontSize=".9rem">
              {formik.errors.max}
            </Pane>
          )}
          <Pane display="flex" alignItems="center">
            <Pane>
              <Label>Min</Label>
              <CustomInput
                width={"70%"}
                type="number"
                isInvalid={
                  !!formik.errors.min &&
                  formik.touched.min &&
                  !!formik.errors.min
                }
                name="min"
                value={formik.values.min}
                onChange={formik.handleChange}
                placeholder="valor mínimo"
                marginRight="5px"
              />
            </Pane>
            <Pane paddingTop="20px">-</Pane>
            <Pane>
              <Label marginLeft="5px">Max</Label>
              <CustomInput
                width={"70%"}
                type="number"
                isInvalid={
                  !!formik.errors.max &&
                  formik.touched.max &&
                  !!formik.errors.max
                }
                name="max"
                value={formik.values.max}
                onChange={formik.handleChange}
                placeholder="valor máximo"
                marginLeft="5px"
              />
            </Pane>
          </Pane>
          <Pane
            width={"100%"}
            display="flex"
            justifyContent="flex-end"
            marginTop={30}
          >
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

export default withRouter(PriceMinMax);

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

const CustomInput = styled(Input)`
  border: 1.5px solid hsl(0, 0%, 92%) !important;
`;

const CustomClose = styled(IconButton)`
  cursor: pointer !important;
  width: 100%;
`;
