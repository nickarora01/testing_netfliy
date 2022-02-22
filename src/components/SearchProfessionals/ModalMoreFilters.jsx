import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  Flex,
  Button,
  Input,
  Checkbox,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Heading,
  Divider,
  Radio,
  Select as ChakraSelect,
  RadioGroup,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
} from "@chakra-ui/react";
import queryString from "query-string";
import { useFormik } from "formik";
import { uniqBy } from "lodash";
import { withRouter } from "react-router-dom";
import AsyncSelect, { Async } from "react-select/async";
import Select from "react-select";
import { useStore, useActions } from "../../configureStore";
import citiesJson from "../../json/portugal_cities.json";
import languages from "../../utils/languages";
import useDebounce from "../../hooks/useDebounce";
import { theme } from "../../theme";
import { formatToList } from "brazilian-values";

const ModalMoreFilters = (props) => {
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
  const queryLat = parseFloat(query.lat) || "";
  const queryLng = parseFloat(query.lng) || "";

  const queryHomeAssistant =
    query.home_assistent === "false"
      ? false
      : query.home_assistent === "true"
      ? true
      : false;

  const [open, setOpen] = useState(false);
  const [cities, setCities] = useState([]);
  const [categoryDefaultOpt, setCategoryDefaultOpt] = useState();
  const [countryDefaultOpt, setCountryDefaultOpt] = useState();
  const [cityDefaultOpt, setCityDefaultOpt] = useState();

  const categories = useStore((state) => state.categories.categories);
  const isLoading = useStore((state) => state.categories.isLoading);
  const getAll = useActions((action) => action.categories.getAll);
  const setLoading = useActions((action) => action.categories.setLoading);

  useEffect(() => {
    getAll();
  }, []);

  setLoading({ loading: false });

  const contries = [
    {
      value: "portugal",
      label: "Portugal",
    },
  ];

  const getContextsForSelectCategory = async (input) => {
    const result = categories.filter((item) =>
      item?.name?.toLowerCase()?.includes(input.toLowerCase())
    );
    const data = result?.map((item) => {
      return { label: item.name, value: item.id };
    });

    return uniqBy(data, "label");
  };

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
    setCities(getContextsForSelectCity(queryCountry));
  }, [queryCountry]);

  //get searched categories
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
    setCategoryDefaultOpt(arr);
  }, [isLoading]);

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

  const validate = (values) => {
    const err = {};
    const message = "Campo obrigatório";

    if (parseFloat(values.min) <= 0)
      err.min = "Valor minimo deve ser maior do que 0";
    if (parseFloat(values.max) <= 0)
      err.max = "Valor máximo deve ser maior do que 0";
    if (parseFloat(values.max) < values.min)
      err.max = "Valor máximo deve ser maior do que o valor minimo!";
    return err;
  };

  const formik = useFormik({
    initialValues: {
      categories: props.categories,
      min: queryPriceMin || "",
      max: queryPriceMax || "",
      country: queryCountry || "",
      gender: queryGender || "",
      city: "",
      language: queryLanguage || "",
      distance: parseFloat(queryDistance) || "",
      homeAssistant: queryHomeAssistant || false,
    },
    onSubmit: (values, { setSubmitting }) => {
      props.history.replace({
        pathname: "/profissionais",
        search: `?start=0&categories=${values?.categories?.join(
          ","
        )}&price_min=${values.min || queryPriceMin}&price_max=${
          values.max || queryPriceMax
        }&language=${values.language || queryLanguage}&city=${
          values.city || queryCity
        }&country=${values.country || queryCountry}&pageNumber=0&gender=${
          values.gender || queryGender
        }&text=${queryText}&distance=${
          values.distance || queryDistance
        }&home_assistent=${
          values.homeAssistant
        }&lat=${queryLat}&lng=${queryLng}`,
        state: { some: "state" },
      });

      // formik.resetForm();
      window.scrollTo(0, 0);
      setLoading({ loading: true });
      setTimeout(() => props.onClose(), 300);
      // props.onClose();
      setSubmitting(false);
      props.setOffset(0);
      props.setPageNumber(0);
    },
    validate,
  });

  const debouncedSearch = useDebounce(formik.values.distance, 200);

  return (
    <Modal
      onClose={props.onClose}
      size={"md"}
      isOpen={props.isOpen}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent maxHeight="700px">
        <ModalHeader height="40px">
          <CustomCloseModal />
          <Heading
            as="h3"
            textAlign="center"
            margin={".5rem 0 0 0"}
            fontSize="1rem"
          >
            Mais Filtros
          </Heading>
        </ModalHeader>
        <ModalBody paddingTop="1rem" paddingX="2rem">
          <ContainerShowOnMobile>
            <Box>
              <Title as="h4">Preço</Title>
              <Flex alignItems="center">
                <CustomInput
                  isInvalid={
                    !!formik.errors.min &&
                    formik.touched.min &&
                    !!formik.errors.min
                  }
                  name="min"
                  value={formik.values.min}
                  onChange={formik.handleChange}
                  placeholder="valor mínimo"
                  marginRight="10px"
                />
                <Box>-</Box>
                <CustomInput
                  isInvalid={
                    !!formik.errors.max &&
                    formik.touched.max &&
                    !!formik.errors.max
                  }
                  name="max"
                  value={formik.values.max}
                  onChange={formik.handleChange}
                  placeholder="valor máximo"
                  marginLeft="10px"
                />
              </Flex>
              <Divider
                marginTop="1.5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>
            <Box>
              <Title as="h4">Distancia</Title>
              <Box flexDirection="column" display="flex" alignItems="center">
                <Flex justifyContent="space-between" width="100%">
                  <Text fontWeight={600}>Até</Text>
                  <Text fontWeight={600}>{`${debouncedSearch} Km`}</Text>
                </Flex>
                {!isLoading && (
                  <Slider
                    step={0.5}
                    defaultValue={formik.values.distance}
                    onChange={(e) => formik.setFieldValue("distance", e)}
                  >
                    <SliderTrack />
                    <SliderFilledTrack />
                    <SliderThumb />
                  </Slider>
                )}
              </Box>
              <Divider
                marginTop="1.5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>
            <Box>
              <Title as="h4">Profissão</Title>
              <Box>
                {!isLoading && (
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
                        top: "50%",
                        // marginTop: "-155px",
                        marginLeft: "-30px",
                      }),
                    }}
                    isMulti
                    defaultValue={categoryDefaultOpt}
                    onChange={(e) => {
                      if (e) {
                        let result = e.map((item) => item.value);
                        formik.setFieldValue("categories", result);
                      }
                    }}
                    loadOptions={(e) => getContextsForSelectCategory(e)}
                    cacheOptions
                    defaultOptions
                  />
                )}
              </Box>
              <Divider
                marginTop=".5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>
          </ContainerShowOnMobile>

          <Box>
            <Title as="h4" marginBottom=".5rem">
              Home Assistant
            </Title>
            {!isLoading && (
              <CustomCheckbox
                onChange={(e) =>
                  formik.setFieldValue("homeAssistant", e.target.checked)
                }
                isChecked={formik.values.homeAssistant}
              >
                Apenas Home Assistant
              </CustomCheckbox>
            )}

            <Divider
              marginTop=".5rem"
              borderColor="#ddd"
              borderWidth="2px"
              cursor="default"
            />
          </Box>

          <ContainerShowOnMobile>
            <Box>
              <Title as="h4">País</Title>
              <Box>
                {!isLoading && (
                  <AsyncSelect
                    name="country"
                    placeholder="Selecione um país..."
                    styles={{
                      control: (base) => ({
                        ...base,
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
              </Box>
              <Divider
                marginTop="1.5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>

            <Box>
              <Title as="h4">Distrito</Title>
              <Box>
                {!isLoading && (
                  <AsyncSelect
                    name="state"
                    placeholder="Selecione um distrito..."
                    styles={{
                      control: (base) => ({
                        ...base,
                      }),
                      menuList: (base) => ({
                        ...base,
                      }),
                    }}
                    onChange={(e) => {
                      setCities(getContextsForSelectCity(e.value));
                      formik.setFieldValue("state", e.value);
                    }}
                    loadOptions={(e) => getContextsForSelectCountry(e)}
                    cacheOptions
                    defaultValue={countryDefaultOpt}
                    defaultOptions
                  />
                )}
              </Box>
              <Divider
                marginTop="1.5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>

            <Box>
              <Title as="h4">Distrito</Title>
              <Box>
                {!isLoading && (
                  <Select
                    name="city"
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
                      formik.setFieldValue("city", e.value);
                    }}
                    defaultValue={cityDefaultOpt}
                    options={cities}
                  />
                )}
              </Box>
              <Divider
                marginTop="1.5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>

            <Box>
              <Title as="h4">Rua</Title>
              <Box>
                {!isLoading && (
                  <Select
                    name="street"
                    placeholder="Selecione uma rua..."
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
                      formik.setFieldValue("street", e.value);
                    }}
                    defaultValue={cityDefaultOpt}
                    options={cities}
                  />
                )}
              </Box>
              <Divider
                marginTop="1.5rem"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </Box>
          </ContainerShowOnMobile>

          <Box>
            <Title as="h4" marginBottom=".5rem">
              Genêro
            </Title>

            {!isLoading && (
              <RadioGroup
                onChange={(e) => formik.setFieldValue("gender", e)}
                value={formik.values?.gender}
                marginBottom={"20px"}
              >
                <CustomRadio marginRight={"10px"} value="1">
                  Feminino
                </CustomRadio>
                <CustomRadio value="2">Masculino</CustomRadio>
              </RadioGroup>
            )}

            <Divider
              marginTop=".5rem"
              borderColor="#ddd"
              borderWidth="2px"
              cursor="default"
            />
          </Box>

          {!isLoading && (
            <Box>
              <Title as="h4" marginBottom=".5rem">
                Idioma
              </Title>
              <Box>
                <CustomSelect
                  isInvalid={
                    !!formik.errors.lang &&
                    formik.touched.lang &&
                    !!formik.errors.lang
                  }
                  err={
                    formik.errors.lang &&
                    formik.touched.lang &&
                    formik.errors.lang
                  }
                  width="100%"
                  value={formik.values.language}
                  placeholder="Selecione um idioma"
                  onChange={(e) =>
                    formik.setFieldValue("language", e.target.value)
                  }
                >
                  {languages?.map((item, idx) => (
                    <option key={idx} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </CustomSelect>
              </Box>
              {/* <Divider
                      paddingTop=".5rem"
                      borderColor="#ddd"
                      borderWidth="2px"
                      cursor="default"
                    /> */}
            </Box>
          )}
        </ModalBody>
        <ModalFooter>
          <Flex width="100%" alignItems="center" justifyContent="space-between">
            <ClearBtn
              onClick={() => {
                props.history.replace({
                  pathname: "/profissionais",
                  search: `?start=0&categories=&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&home_assistant=&lat=${queryLat}&lng=${queryLng}`,
                  state: { some: "state" },
                });
                props.setOffset(0);
                props.setPageNumber(0);
                props.onClose();
              }}
            >
              Limpar
            </ClearBtn>
            <BtnSave onClick={formik.submitForm}>Filtrar</BtnSave>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default withRouter(ModalMoreFilters);

const Title = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 1.2rem;
  font-weight: 600;
  margin: 1.5rem 0 1rem 0;
`;

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

const ClearBtn = styled(Button)`
  border: none;
  background-color: transparent !important;
  text-decoration: underline;
  cursor: pointer;
  :focus,
  :hover {
    opacity: 0.7;
  }
`;

const CustomCheckbox = styled(Checkbox)`
  margin-bottom: 1rem;
  align-items: flex-start !important;
  .css-nlndso {
    color: #ddd;
    margin-top: 0.2rem;
  }
  border-color: lightgray;
`;

const ContainerShowOnMobile = styled(Box)`
  display: none;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    display: block;
  }
`;

const CustomInput = styled(Input)`
  border: 1.5px solid hsl(0, 0%, 92%) !important;
`;

const CustomRadio = styled(Radio)`
  border-color: #ccc !important;
`;

const CustomSelect = styled(ChakraSelect)`
  height: 50px !important;
  border: 2px solid #eee !important;
`;
