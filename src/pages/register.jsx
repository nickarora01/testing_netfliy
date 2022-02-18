import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useFormik } from "formik";
import { RadioGroup, Checkbox } from "evergreen-ui";
import { Input, Box, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { formatToDate, parseToDate } from "brazilian-values";
import { Rifm } from "rifm";
import { theme } from "../theme";
import { useStore, useActions } from "../configureStore";
import { formatDate, formatNIF } from "../utils/helper";
import useWindowSize from "../hooks/useWIndowSize";
import districtJson from "../json/portugal_district.json";
import Select from "react-select";
import { PasswordTest } from "../utils/helper";

const MyInput = (props) => {
  const { width } = useWindowSize();

  return (
    <Box
      width={"100%"}
      marginBottom={width <= 1024 ? "1rem" : width <= 440 ? "2rem" : "0rem"}
    >
      <Label>{props.label}</Label>
      <CustomInput {...props} marginBottom={".3rem"} />
      <MessageError>{props.err}</MessageError>
    </Box>
  );
};

export default function Login(props) {
  const [type, setType] = useState("1");
  const { width } = useWindowSize();
  const isLoading = useStore((state) => state.auth.isAuthLoading);
  const authError = useStore((state) => state.auth.authError);
  const isAuth = useStore((state) => state.auth.isAuthenticated);
  const updateError = useActions((state) => state.auth.updateAuthError);
  const signup = useActions((actions) => actions.auth.createUser);
  const updateProfile = useActions((action) => action.user.updateProfile);

  const [termsPolicy, setTermsPolicy] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        updateError("");
      }, 6000);
    }
  }, [authError]);

  const validate = (values) => {
    const err = {};

    const message = "Campo obrigatório";

    if (!values.name) err.name = message;
    if (!props.data?.id && !PasswordTest(values.password))
      err.password =
        "Senha deve conter letras maiúsculas e minúsculas, números e caracteres especiais (@$!%*?&#)";
    if (!values.email) err.email = message;
    if (!values.birthday) err.birthday = message;
    if (!values.phone1) err.phone1 = message;
    if (!values.cpf) err.cpf = message;
    if (values.cpf && values.cpf.length > 0) {
      if (parseInt(values.cpf[0]) > 4 || parseInt(values.cpf[0]) === 0)
        err.cpf = "NIF inválido";
    }
    if (!values.rg) err.rg = message;
    if (!values.rg_emissor) err.rg_emissor = message;
    if (!values.payment) err.payment = message;
    if (!values.street) err.street = message;
    if (!values.number) err.number = message;
    if (!values.district) err.district = message;
    if (!values.state) err.state = message;
    if (!values.city) err.city = message;
    if (!values.country) err.country = message;
    if (!values.zipcode) err.zipcode = message;

    return err;
  };

  const formik = useFormik({
    initialValues: {
      name: props.data?.name || "",
      email: props.data?.email || "",
      password: "",
      birthday:
        (props.data?.birthday?.length > 0 &&
          formatToDate(new Date(props.data?.birthday))) ||
        "",
      phone1: props.data?.user_info?.phone1 || "",
      cpf: props.data?.user_info?.cpf || "",
      rg: props.data?.user_info?.rg || "",
      rg_emissor: props.data?.user_info?.rg_emissor || "",
      type: 1,
      type_user: true,
      payment: props.data?.user_info?.payment?.toString() || "1",
      street: props.data?.address?.street || "",
      number: props.data?.address?.number || "",
      district: props.data?.address?.district || "",
      state: props.data?.address?.state || "",
      city: props.data?.address?.city || "",
      country: props.data?.address?.country || "",
      zipcode: props.data?.address?.zipcode || "",
      complement: props.data?.address?.complement || "",
      type_work: props.data?.user_info?.type_work,
    },
    onSubmit: (values, { setSubmitting }) => {
      if (window.location.pathname?.includes("conta")) {
        updateProfile({
          profile: {
            name: values.name,
            email: values.email,
            birthday: parseToDate(values.birthday),
          },
          user_info: {
            phone1: values.phone1,
            // cpf: values.cpf,
            // rg: values.rg,
            // rg_emissor: values.rg_emissor,
            type: parseInt(values.type),
            payment: parseInt(values.payment),
            type_home_assistent: values.type_home_assistent,
            type_user: true,
            type_work: values.type_work,
          },
          address: {
            street: values.street,
            number: parseInt(values.number),
            district: values.district,
            state: values.state,
            city: values.city,
            country: values.country,
            zipcode: values.zipcode,
            complement: values.complement,
          },
          available: null,
          user_language: [],
        });
      } else {
        signup({
          name: values.name,
          email: values.email,
          password: values.password,
          birthday: parseToDate(values.birthday),
          user_info: {
            phone1: values.phone1,
            cpf: values.cpf,
            rg: values.rg,
            rg_emissor: values.rg_emissor,
            type: parseInt(values.type),
            payment: parseInt(values.payment),
            type_user: true,
          },
          address: {
            street: values.street,
            number: parseInt(values.number),
            district: values.district,
            state: values.state,
            city: values.city,
            country: values.country,
            zipcode: values.zipcode,
            complement: values.complement,
          },
        });
      }
      setSubmitting(false);
    },
    validate,
  });

  return (
    <Content {...props}>
      <Title>Cadastro</Title>
      {authError && (
        <Alert status="error">
          <AlertIcon />
          {authError}
        </Alert>
      )}
      <MyForm onSubmit={formik.handleSubmit}>
        <Grid>
          <MyInput
            isInvalid={
              !!formik.errors.name &&
              formik.touched.name &&
              !!formik.errors.name
            }
            err={
              formik.errors.name && formik.touched.name && formik.errors.name
            }
            label="Nome Completo"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="ex: João da Silva"
          />
          <Rifm
            accept={/\d+/g}
            format={formatDate}
            value={formik.values.birthday}
            onChange={(e) => {
              formik.setFieldValue("birthday", e);
              let breakDate = e.split("/");
              if (breakDate && breakDate[1]) {
                if (parseInt(breakDate[0]) > 31) {
                  breakDate.splice(0, 1, "31");
                  formik.setFieldValue("birthday", breakDate.join("/"));
                }
                if (parseInt(breakDate[1]) > 12) {
                  breakDate.splice(1, 1, "12");
                  formik.setFieldValue("birthday", breakDate.join("/"));
                }
              }
            }}
          >
            {({ value, onChange }) => (
              <MyInput
                isInvalid={
                  !!formik.errors.birthday &&
                  formik.touched.birthday &&
                  !!formik.errors.birthday
                }
                err={
                  formik.errors.birthday &&
                  formik.touched.birthday &&
                  formik.errors.birthday
                }
                label="Data de nascimento"
                name="birthday"
                placeholder="ex: 10/05/1990"
                value={value}
                onChange={onChange}
                onBlur={formik.handleBlur}
              />
            )}
          </Rifm>
          <Rifm
            accept={/\d+/g}
            format={formatNIF}
            value={formik.values.cpf}
            onChange={(e) => {
              formik.setFieldValue("cpf", e);
            }}
          >
            {({ value, onChange }) => (
              <MyInput
                disabled={props.data?.id > 0 ? true : false}
                isInvalid={
                  !!formik.errors.cpf &&
                  formik.touched.cpf &&
                  !!formik.errors.cpf
                }
                err={
                  formik.errors.cpf && formik.touched.cpf && formik.errors.cpf
                }
                label="NIF"
                placeholder="NIF"
                name="cpf"
                type="tel"
                value={value}
                onChange={onChange}
                onBlur={formik.handleBlur}
              />
            )}
          </Rifm>
          <Row>
            <MyInput
              disabled={props.data?.id > 0 ? true : false}
              isInvalid={
                !!formik.errors.rg && formik.touched.rg && !!formik.errors.rg
              }
              err={formik.errors.rg && formik.touched.rg && formik.errors.rg}
              width={
                width === 1024
                  ? "80% !important"
                  : width >= 1280 && "85% !important"
              }
              label="Documento de identificação"
              name="rg"
              value={formik.values.rg}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="ex: 123456789"
            />
            <MyInput
              disabled={props.data?.id > 0 ? true : false}
              isInvalid={
                !!formik.errors.rg_emissor &&
                formik.touched.rg_emissor &&
                !!formik.errors.rg_emissor
              }
              err={
                formik.errors.rg_emissor &&
                formik.touched.rg_emissor &&
                formik.errors.rg_emissor
              }
              width={
                width === 1024
                  ? "80% !important"
                  : width >= 1280 && "87% !important"
              }
              label="Emitido por"
              name="rg_emissor"
              value={formik.values.rg_emissor}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Row>
          <MyInput
            isInvalid={
              !!formik.errors.zipcode &&
              formik.touched.zipcode &&
              !!formik.errors.zipcode
            }
            err={
              formik.errors.zipcode &&
              formik.touched.zipcode &&
              formik.errors.zipcode
            }
            label="Código postal"
            name="zipcode"
            placeholder="ex: 11111-111"
            value={formik.values.zipcode}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <MyInput
            isInvalid={
              !!formik.errors.street &&
              formik.touched.street &&
              !!formik.errors.street
            }
            err={
              formik.errors.street &&
              formik.touched.street &&
              formik.errors.street
            }
            label="Rua"
            name="street"
            placeholder="ex: av. paulista"
            value={formik.values.street}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Row>
            <MyInput
              isInvalid={
                !!formik.errors.number &&
                formik.touched.number &&
                !!formik.errors.number
              }
              err={
                formik.errors.number &&
                formik.touched.number &&
                formik.errors.number
              }
              width={
                width === 1024
                  ? "80% !important"
                  : width >= 1280 && "85% !important"
              }
              label="Nº"
              name="number"
              placeholder="ex: 100"
              value={formik.values.number}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            <MyInput
              isInvalid={
                !!formik.errors.complement &&
                formik.touched.complement &&
                !!formik.errors.complement
              }
              err={
                formik.errors.complement &&
                formik.touched.complement &&
                formik.errors.complement
              }
              width={
                width === 1024
                  ? "80% !important"
                  : width >= 1280 && "87% !important"
              }
              label="Complemento"
              name="complement"
              placeholder="ex: Apartamento 77"
              value={formik.values.complement}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Row>
          <MyInput
            isInvalid={
              !!formik.errors.district &&
              formik.touched.district &&
              !!formik.errors.district
            }
            err={
              formik.errors.district &&
              formik.touched.district &&
              formik.errors.district
            }
            width={`100%`}
            label="Freguesia"
            placeholder="ex: Jd america"
            name="district"
            value={formik.values.district}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <MyInput
            isInvalid={
              !!formik.errors.city &&
              formik.touched.city &&
              !!formik.errors.city
            }
            err={
              formik.errors.city && formik.touched.city && formik.errors.city
            }
            label="Concelho"
            name="city"
            value={formik.values.city}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {districtJson?.length > 0 && (
            <Box>
              <Label>{`Distrito`}</Label>
              <MySelect
                placeholder="Selecione um distrito..."
                isDisabled={districtJson?.length === 0}
                styles={{
                  control: (base) => ({
                    ...base,
                    height: "50px",
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
                defaultValue={{
                  label: formik.values.state,
                  value: formik.values.state,
                }}
              />
            </Box>
          )}
          <MyInput
            isInvalid={
              !!formik.errors.country &&
              formik.touched.country &&
              !!formik.errors.country
            }
            err={
              formik.errors.country &&
              formik.touched.country &&
              formik.errors.country
            }
            width={`100%`}
            label="País"
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <MyInput
            isInvalid={
              !!formik.errors.phone1 &&
              formik.touched.phone1 &&
              !!formik.errors.phone1
            }
            err={
              formik.errors.phone1 &&
              formik.touched.phone1 &&
              formik.errors.phone1
            }
            label="Telefone"
            placeholder="111 111 111"
            name="phone1"
            value={formik.values.phone1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <MyInput
            isInvalid={
              !!formik.errors.email &&
              formik.touched.email &&
              !!formik.errors.email
            }
            err={
              formik.errors.email && formik.touched.email && formik.errors.email
            }
            readOnly="readonly"
            onFocus={(event) => {
              event.target.removeAttribute("readonly");
            }}
            autoComplete={false}
            label="E-mail"
            placeholder="joao@email.com"
            name="email"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {props.data?.id > 0 ? (
            <div></div>
          ) : (
            <MyInput
              isInvalid={
                !!formik.errors.password &&
                formik.touched.password &&
                !!formik.errors.password
              }
              err={
                formik.errors.password &&
                formik.touched.password &&
                formik.errors.password
              }
              label="Senha"
              placeholder="senha"
              autoComplete={false}
              name="password"
              type="password"
              readOnly="readonly"
              onFocus={(event) => {
                event.target.removeAttribute("readonly");
              }}
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          )}
        </Grid>
        {!isAuth && (
          <Box>
            <Checkbox
              label="Aceito os termos e condições de uso."
              checked={termsAndConditions}
              onChange={(e) => setTermsAndConditions(e.target.checked)}
            />
            <Checkbox
              label="Aceito os termos de política de privacidade."
              checked={termsPolicy}
              onChange={(e) => setTermsPolicy(e.target.checked)}
            />
          </Box>
        )}
        <Box width={width <= 440 ? "100%" : "50%"} margin="0 auto">
          <Button
            disabled={
              formik.isSubmitting ||
              (!isAuth && (!termsAndConditions || !termsPolicy))
            }
            type="submit"
            height="45px"
            textTransform="uppercase"
            color="white"
            fontSize="1rem"
            backgroundColor={theme.color.green}
            border="none"
            width="100%"
            cursor="pointer"
            marginTop="4rem"
            _hover={{
              backgroundColor: theme.color.green,
              opacity: 0.8,
            }}
            _focus={{
              backgroundColor: theme.color.green,
              opacity: 0.8,
            }}
          >
            {window.location.pathname?.includes("conta")
              ? formik.isSubmitting
                ? "Atualizando"
                : "Atualizar"
              : formik.isSubmitting
              ? "Cadastrando"
              : "Cadastrar"}
          </Button>
        </Box>
      </MyForm>
    </Content>
  );
}

const Content = styled(Box)`
  padding: 3rem 0;
  min-height: 500px;
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 3rem 1rem;
  }
`;

const Title = styled.h1`
  padding: 0;
  margin: 0 0 1rem 0;
  color: ${(props) => props.theme.color.green};
`;

const MyForm = styled.form`
  padding: 2rem 0;
`;

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px 40px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: flex;
    flex-direction: column;
  }
`;

const Col = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Row = styled(Box)`
  display: flex;
  flex-direction: row;
  align-items: center;
  height: ${(props) => (props.height !== "undefined" ? props.height : "45px")};
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    flex-direction: column;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    align-items: flex-start;
  }
`;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

//my input component
const Label = styled.label`
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;

const CustomInput = styled(Input)`
  margin-top: 0.1rem;
  width: 94% !important;
  border: 2px solid #eee !important;
  height: 45px !important;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    width: 90% !important;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    width: 95% !important;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 90% !important;
  }
`;

const CustomRadio = styled(RadioGroup)`
  height: 50px;
  display: flex;
  align-items: center;
  label > span {
    font-size: 1.1rem !important;
  }
  label:nth-child(2) {
    margin-left: 1rem;
  }
  label:nth-child(3) {
    margin-left: 1rem;
  }

  .css-1bkiqpw:checked + div {
    background-image: linear-gradient(to bottom, #8cc73d, #8cc73d);
  }
`;

const MySelect = styled(Select)`
  margin-bottom: 2rem;
`;
