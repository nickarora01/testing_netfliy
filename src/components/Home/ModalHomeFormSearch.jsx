import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { withRouter, useHistory } from "react-router-dom";
import Select from "react-select";
import { uniqBy } from "lodash";
import AsyncSelect from "react-select/async";
import { useFormik } from "formik";
import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  Text,
} from "@chakra-ui/react";
import { useActions, useStore } from "../../configureStore";
import citiesJson from "../../json/portugal_cities.json";
import districtJson from "../../json/portugal_district.json";
import { theme } from "../../theme";

const ModalHomeFormSearch = (props) => {
  const history = useHistory();
  const categories = useStore((state) => state.categories.categories);
  const loading = useStore((state) => state.categories.isLoading);
  const getAll = useActions((action) => action.categories.getAll);

  const [cities, setCities] = useState([]);

  useEffect(() => {
    getAll();
  }, []);

  const contries = [
    {
      value: "portugal",
      label: "Portugal",
    },
  ];

  const validate = (values) => {
    const err = {};

    const message = "Campo obrigatório";

    if (values.categories?.length === 0) err.categories = message;
    if (!values.country) err.country = message;

    return err;
  };

  const formik = useFormik({
    initialValues: {
      categories: [],
      country: "",
      state: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      const params = `/profissionais?categories=${formik.values.categories.join(
        ","
      )}&country=${formik.values.country}&state=${formik.values.state}`;
      history.push(params);

      props.history.push("/profissionais");
      props.onClose();

      setSubmitting(false);
      formik.resetForm();
    },
    validate,
  });

  const getContextsForSelectCategory = async (input) => {
    const result = categories.filter((item) =>
      item?.name?.toLowerCase()?.includes(input.toLowerCase())
    );
    const data = result?.map((item) => {
      return { label: item.name, value: item.id };
    });
    return uniqBy(data, "label");
  };

  const getContextsForSelectCountry = async () => {
    return contries;
  };

  const getContextsForSelectCity = (input) => {
    const result = citiesJson.map((item) => {
      if (item.country === input) {
        return { label: item.city, value: item.city };
      }
    });
    return result;
  };

  return (
    <Modal
      onClose={props.onClose}
      // size={"680px"}
      min
      isOpen={props.isOpen}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <CustomModalContent>
        <ModalHeader height="40px">
          <CustomCloseModal />
        </ModalHeader>
        <CustomModalBody paddingTop="1rem">
          <BoxFormSearch display={formik.isSubmitting ? "none" : "block"}>
            <FormSearch onSubmit={formik.handleSubmit} noValidate>
              <Container>
                <Text color="#333">Do que você precisa? </Text>
                {!loading && categories?.length > 0 && (
                  <MySelect
                    name="categories"
                    placeholder="Selecione uma atividade..."
                    styles={{
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
                        "min-height": "54px",
                      }),
                      menuList: (base) => ({
                        ...base,
                        minHeight: "fit-content",
                      }),
                    }}
                    isMulti
                    onChange={(e) => {
                      if (e) {
                        const result = e.map((item) => item.value);
                        formik.setFieldValue("categories", result);
                      }
                    }}
                    loadOptions={(e) => getContextsForSelectCategory(e)}
                    cacheOptions
                    defaultOptions
                  />
                )}
                <MessageError>
                  {formik.errors.categories &&
                    formik.touched.categories &&
                    formik.errors.categories}
                </MessageError>
              </Container>
              <Container>
                <Text color="#333">Em que país você precisa? </Text>
                {!loading && (
                  <MySelect
                    name="country"
                    placeholder="Selecione um país..."
                    styles={{
                      control: (base) => ({
                        ...base,
                        minHeight: "54px",
                        "min-height": "54px",
                      }),
                      menu: (base) => ({
                        ...base,
                        // minHeight: "fit-content",
                      }),
                    }}
                    onChange={(e) => {
                      setCities(getContextsForSelectCity(e.value));
                      formik.setFieldValue("country", e.value);
                    }}
                    loadOptions={(e) => getContextsForSelectCountry(e)}
                    cacheOptions
                    defaultOptions
                  />
                )}
                <MessageError>
                  {formik.errors.country &&
                    formik.touched.country &&
                    formik.errors.country}
                </MessageError>
              </Container>
              <Container>
                <Text color="#333">Em que distrito você precisa?</Text>
                {!loading && (
                  <Select
                    placeholder="Selecione um distrito..."
                    isDisabled={cities?.length === 0}
                    styles={{
                      control: (base) => ({
                        ...base,
                        height: "54px",
                        "min-height": "34px",
                      }),
                      menuList: (base) => ({
                        ...base,
                        minHeight: "fit-content",
                      }),
                    }}
                    onChange={(e) => {
                      formik.setFieldValue("state", e.label);
                    }}
                    options={districtJson}
                  />
                )}
              </Container>
              <Button
                width={"100%"}
                marginTop="2rem"
                cursor="pointer"
                backgroundColor={theme.color.green}
                border="none"
                height={"50px"}
                color={theme.color.white}
                borderRadius={".2rem"}
                type="submit"
                _hover={{
                  backgroundColor: theme.color.green,
                  opacity: 0.8,
                }}
              >
                Buscar
              </Button>
            </FormSearch>
          </BoxFormSearch>
        </CustomModalBody>
      </CustomModalContent>
    </Modal>
  );
};

export default withRouter(ModalHomeFormSearch);

const CustomCloseModal = styled(ModalCloseButton)`
  cursor: pointer;
  border: none !important;
  background-color: transparent !important;
  top: 20px !important;
  right: 20px !important;
  left: 20px !important;
  svg {
    height: 15px !important;
    width: 15px !important;
  }
`;

const CustomModalBody = styled(ModalBody)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    input {
      width: 90%;
    }
    button {
      margin-bottom: 1rem;
    }
  }
`;

//content

const BoxFormSearch = styled(Box)`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
`;

const FormSearch = styled.form`
  padding-bottom: 10px;
  background-color: ${(props) => props.theme.color.white};
  border-radius: 4px;
  display: flex;
  flex-direction: column;

  right: 2rem;
  margin-left: auto;

  .input-home {
    height: 48px;
    width: 90%;
    background: #f2f2f2;
    margin-bottom: 24px;
  }

  p {
    margin: 0;
    text-align: left;
  }
`;

const Container = styled(Box)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin-bottom: 1rem;
  }
`;

const MySelect = styled(AsyncSelect)`
  margin-bottom: 24px;
`;

const MessageError = styled(Box)`
  transition: 0.2s ease-in-out;
  margin-bottom: 10px;
  margin-top: -20px;
  height: 20px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

const CustomModalContent = styled(ModalContent)`
  border-radius: 0.5rem !important;
  max-width: 680px !important;
  max-height: 550px !important;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    max-width: 340px !important;
  }
  @media (max-width: ${(props) => props.theme.queries.i5}) {
    max-width: 300px !important;
    max-height: 600px !important;
  }
`;
