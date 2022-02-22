import React from "react";
import styled from "styled-components";
import {
  Box,
  Flex,
  Text,
  Button,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import { Popover, IconButton, Pane } from "evergreen-ui";
import queryString from "query-string";
import { useFormik } from "formik";
import { withRouter } from "react-router-dom";
import useDebounce from "../../../hooks/useDebounce";

const DistanceModal = (props) => {
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
  const queryDistance = query.distance || "";
  const queryHomeAssistant = query.home_assistant || false;
  const queryLat = parseFloat(query.lat) || "";
  const queryLng = parseFloat(query.lng) || "";

  const validate = (values) => {
    const err = {};
    const message = "Campo obrigatório";
    if (values.distance <= 0)
      err.min = "Valor minimo deve ser maior do que 0 km";

    return err;
  };

  const formik = useFormik({
    initialValues: {
      distance: parseInt(queryDistance) || 0,
    },
    onSubmit: (values, { setSubmitting }) => {
      if (values.distance > 0) {
        props.history.replace({
          pathname: "/profissionais",
          search: `?start=${queryOffset}&categories=${queryCategories}&price_min=${queryPriceMin}&price_max=${queryPriceMax}&language=${queryLanguage}&city=${queryCity}&country=${queryCountry}&pageNumber=${queryPageNumber}&gender=${queryGender}&text=${queryText}&distance=${values.distance}&lat=${queryLat}&lng=${queryLng}`,
          state: { some: "state" },
        });
        window.scrollTo(0, 0);
        setSubmitting(false);
      }
      formik.resetForm();
    },
    validate,
  });

  const debouncedSearch = useDebounce(formik.values.distance, 200);

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
          <Pane
            width={"100%"}
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <Pane
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              width="100%"
            >
              <Text fontWeight={600}>Até</Text>
              <Text fontWeight={600}>{`${debouncedSearch} Km`}</Text>
            </Pane>
            <Slider
              step={0.5}
              defaultValue={formik.values.distance}
              max={200}
              onChange={(e) => formik.setFieldValue("distance", e)}
            >
              <SliderTrack />
              <SliderFilledTrack />
              <SliderThumb />
            </Slider>
          </Pane>
          <Pane
            display="flex"
            justifyContent="flex-end"
            marginTop={30}
            width={"100%"}
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

export default withRouter(DistanceModal);

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
