import { Box, Input, Textarea } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { Rifm } from "rifm";
import styled from "styled-components";
import useWindowSize from "../../hooks/useWIndowSize";
import {
  formatDate,
  formatNIF,
  formatPhone,
  formatZip,
} from "../../utils/helper";
import MyInput from "./MyInput";
import MyRadio from "./MyRadio";
import districtJson from "../../json/portugal_district.json";
import MySelect from "./MySelect";
import { Checkbox as EverCheckbox, Icon } from "evergreen-ui";
import MyButton from "./MyButton";
import { formatToDate, isDate } from "brazilian-values";
import { useActions, useStore } from "../../configureStore";
import { PasswordTest } from "../../utils/helper";

const PessonalIdentification = (props) => {
  const { width } = useWindowSize();
  const {
    values,
    nextStep,
    typeRegister,
    save,
    payloader,
    stepCurrent,
    edit,
    _formik,
  } = props;

  const [termsPolicy, setTermsPolicy] = useState(false);
  const [termsAndConditions, setTermsAndConditions] = useState(false);

  const isAuth = useStore((state) => state.auth.isAuthenticated);

  const _type = values?.user_info?.type || typeRegister;

  let formik = useFormik({
    initialValues: {
      type: _type,
      type_work: values?.user_info?.type_work || _type === 2,
      type_user: values?.user_info?.type_user || _type === 1,
      type_home_assistent:
        values?.user_info?.type_home_assistent || _type === 3,
      id: values?.id || 0,
      name: values?.name || "",
      date_born:
        (values?.birthday?.length > 0 &&
          formatToDate(new Date(values?.birthday))) ||
        "",
      gender: values?.gender || "1",
      cpf: values?.user_info?.cpf || "",
      rg: values?.user_info?.rg || "",
      uf: values?.user_info?.rg_emissor || "",
      zipcode: values?.address?.zipcode || "",
      street: values?.address?.street || "",
      number: values?.address?.number || "",
      complement: values?.address?.complement || "",
      district: values?.address?.district || "",
      city: values?.address?.city || "",
      state: values?.address?.state || "",
      country: values?.address?.country || "",
      phone1: values?.user_info?.phone1 || "",
      email: values?.email || "",
      password: "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const auth = JSON.parse(localStorage.getItem("4you_auth"));
      const payload = payloader(values);
      await save({ payload, id: auth?.user?.id || 0, step: 1, edit: false });
      setSubmitting(false);
    },
    validate: (values) => {
      const err = {};
      const message = "Campo obrigatório";
      const message_invalid = "Valor inválido";
      if (!values.name) err.name = message;
      // if (!values.date_born) err.date_born = message;
      // if (!isDate(values.data_born))
      //   err.date_born = "Data de nascimento inválida";
      // if (values.date_born) {
      //   const breakdate = values.date_born.split("/");
      //   if (breakdate && breakdate.length === 3) {
      //     const dt = new Date(
      //       `${breakdate[2]}-${breakdate[1]}-${breakdate[0]}`
      //     );
      //     if (
      //       isNaN(dt) ||
      //       dt >
      //         new Date(
      //           new Date().getFullYear(),
      //           new Date().getMonth(),
      //           new Date().getDate()
      //         )
      //     ) {
      //       err.date_born = "Data de Nascimento Inválida";
      //     }
      //   } else if (breakdate && breakdate.length > 0) {
      //     for (let item of breakdate) {
      //       if (parseInt(item) === 0)
      //         err.date_born = "Data de Nascimento Inválida";
      //     }
      //   } else err.date_born = "Data de Nascimento Inválida";
      // }
      if (values.cpf && values.cpf.length > 0) {
        if (parseInt(values.cpf[0]) > 4 || parseInt(values.cpf[0]) === 0)
          err.cpf = "NIF inválido";
      }
      if (!values.cpf) err.cpf = message;
      if (!values.rg) err.rg = message;
      if (!values.uf) err.uf = message;
      if (!values.zipcode) err.zipcode = message;
      if (!values.street) err.street = message;
      if (!values.number) err.number = message;
      if (!values.district) err.district = message;
      if (!values.city) err.city = message;
      if (!values.state) err.state = message;
      if (!values.country) err.country = message;
      if (!values.phone1) err.phone1 = message;
      if (!values.email) err.email = message;
      if (!values.id && !PasswordTest(values.password))
        err.password =
          "Senha deve conter letras maiúsculas e minúsculas, números e caracteres especiais (@$!%*?&#)";

      return err;
    },
  });
  formik = edit ? _formik : formik;

  return (
    <MyForm onSubmit={formik.handleSubmit} autocomplete="off">
      <Grid width={width}>
        <MyInput
          isInvalid={
            !!formik.errors.name && formik.touched.name && !!formik.errors.name
          }
          err={formik.errors.name && formik.touched.name && formik.errors.name}
          label="Nome Completo"
          name="name"
          placeholderTemplate="Insira o"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          value={formik.values.name}
          infoMessage="Nome	Escreva seu nome da mesma forma que aparece no seu documento de identificação. Os demais usuários da plataforma só vão ver seu primeiro nome."
        />
        <Rifm
          accept={/\d+/g}
          format={formatDate}
          value={formik.values.date_born}
          onChange={(e) => {
            formik.setFieldValue("date_born", e);
            let breakDate = e.split("/");
            if (breakDate && breakDate[1]) {
              if (parseInt(breakDate[0]) > 31) {
                breakDate.splice(0, 1, "31");
                formik.setFieldValue("date_born", breakDate.join("/"));
              }
              if (parseInt(breakDate[1]) > 12) {
                breakDate.splice(1, 1, "12");
                formik.setFieldValue("date_born", breakDate.join("/"));
              }
            }
          }}
        >
          {({ value, onChange }) => (
            <MyInput
              label="Data nascimento"
              placeholder="ex: 20/01/2000"
              name="date_born"
              value={value}
              onChange={onChange}
              onBlur={formik.handleBlur}
              infoMessage="Digite no formato DD-MM-AAAA. Esta informação é restrita - não aparece para os demais usuários"
            />
          )}
        </Rifm>
        <MyRadio
          myLabel="Genêro"
          name="gender"
          value={formik.values.gender}
          options={[
            { label: "Feminino", value: "1" },
            { label: "Masculino", value: "2" },
            { label: "Outros", value: "3" },
          ]}
          onChange={(e) => {
            formik.setFieldValue("gender", e.target.value);
          }}
        />
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
              disabled={formik.values.id > 0 ? true : false}
              isInvalid={
                !!formik.errors.cpf && formik.touched.cpf && !!formik.errors.cpf
              }
              err={formik.errors.cpf && formik.touched.cpf && formik.errors.cpf}
              label="NIF"
              labelForced="NIF"
              placeholderTemplate="Insira o"
              name="cpf"
              type="tel"
              value={value}
              onChange={onChange}
              onBlur={formik.handleBlur}
              infoMessage="Informe o seu número de identificação fiscal pessoal, não o empresarial. Informação Restrita"
            />
          )}
        </Rifm>
        <MyInput
          isInvalid={
            !!formik.errors.rg && formik.touched.rg && !!formik.errors.rg
          }
          err={formik.errors.rg && formik.touched.rg && formik.errors.rg}
          disabled={formik.values.id > 0 ? true : false}
          label="Número documento identificação"
          placeholder="CC, AR ou Passaporte"
          name="rg"
          value={formik.values.rg}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          maxlength={20}
          infoMessage="Insira o documento de identificação válido no país onde deseja trabalhar. Informação Restrita"
        />
        <MyInput
          isInvalid={
            !!formik.errors.uf && formik.touched.uf && !!formik.errors.uf
          }
          err={formik.errors.uf && formik.touched.uf && formik.errors.uf}
          disabled={formik.values.id > 0 ? true : false}
          label="Emitido por"
          placeholder="Insira o Emitido por"
          name="uf"
          value={formik.values.uf}
          maxlength={48}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Insira o nome da instituição que emitiu seu documento. Para Cartão do Cidadão, informe República Portuguesa."
        />
      </Grid>
      <Grid width={width}>
        <Rifm
          accept={/\d+/g}
          format={formatZip}
          value={formik.values.zipcode}
          onChange={(e) => {
            formik.setFieldValue("zipcode", e);
          }}
        >
          {({ value, onChange }) => (
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
              type="tel"
              label="Código postal"
              placeholder="ex: 1111-111"
              name="zipcode"
              value={value}
              onChange={onChange}
              onBlur={formik.handleBlur}
              infoMessage="Formato XXXX-XXX - Informação Restrita"
            />
          )}
        </Rifm>
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
          type="text"
          label="Rua"
          placeholder="ex: av. paulista"
          name="street"
          value={formik.values.street}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Escreva Rua, Av, Praça ou Trav e o nome do logradouro da sua morada – Informação Restrita"
        />
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
          label="Nº"
          placeholder="ex: 600"
          name="number"
          value={formik.values.number}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Numeração da rua"
        />
        <MyInput
          label="Complemento"
          placeholder="ex: ap 100"
          name="complement"
          value={formik.values.complement}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Demais informações da localização da morada"
        />
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
          label="Freguesia"
          placeholder="ex: jd. america"
          name="district"
          value={formik.values.district}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <MyInput
          isInvalid={
            !!formik.errors.city && formik.touched.city && !!formik.errors.city
          }
          err={formik.errors.city && formik.touched.city && formik.errors.city}
          label="Concelho"
          name="city"
          placeholderTemplate="Insira o"
          value={formik.values.city}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {districtJson?.length > 0 && (
          <MySelect
            err={
              formik.errors.state && formik.touched.state && formik.errors.state
            }
            label="Distrito"
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
            defaultValue={{
              label: formik.values.state,
              value: formik.values.state,
            }}
            options={districtJson}
            maxlength={20}
          />
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
          label="País"
          placeholderTemplate="Insira o"
          name="country"
          value={formik.values.country}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Grid>
      <Grid width={width}>
        <Rifm
          accept={/[0-9\)\(\+\-\s]+/g}
          format={formatPhone}
          value={formik.values.phone1}
          onChange={(e) => {
            formik.setFieldValue("phone1", e);
          }}
        >
          {({ value, onChange }) => (
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
              label="Telemóvel"
              placeholder="+351123456"
              name="phone1"
              value={value}
              onChange={onChange}
              onBlur={formik.handleBlur}
              maxlength={20}
              infoMessage="Informe o melhor para contato com código de país e área – Informação Restrita"
            />
          )}
        </Rifm>
        <MyInput
          isInvalid={
            !!formik.errors.email &&
            formik.touched.email &&
            !!formik.errors.email
          }
          err={
            formik.errors.email && formik.touched.email && formik.errors.email
          }
          label="E-mail"
          placeholder="ex: joao@email.com"
          name="email"
          readOnly="readonly"
          onFocus={(event) => {
            event.target.removeAttribute("readonly");
          }}
          value={formik.values.email}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Informe o mais utilizado, pois enviaremos alertas para esse endereço a cada contato de potenciais clientes"
        />
        {formik.values.id === 0 && (
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
            type="password"
            label="Senha"
            name="password"
            readOnly="readonly"
            onFocus={(event) => {
              event.target.removeAttribute("readonly");
            }}
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            infoMessage="Utilize uma combinação de no mínimo 8 dígitos, com letras maiúsculas e minúsculas, números e caracteres especiais (@$!%*?&#)"
          />
        )}
      </Grid>
      {!isAuth && (
        <Box padding={"1em"}>
          <EverCheckbox
            label="Aceito os termos e condições de uso."
            checked={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.checked)}
          />
          <EverCheckbox
            label="Aceito os termos de política de privacidade."
            checked={termsPolicy}
            onChange={(e) => setTermsPolicy(e.target.checked)}
          />
          {!termsAndConditions && !termsPolicy && (
            <MessageError>
              {"Deve ser aceito os termos de uso e privacidade"}
            </MessageError>
          )}
        </Box>
      )}

      {(!edit ||
        (edit &&
          formik.values.type_user &&
          !formik.values.type_work &&
          !formik.values.type_home_assistent)) && (
        <Box padding={"1em"} display={"flex"}>
          <MyButton
            disabled={
              formik.isSubmitting ||
              (!isAuth && (!termsAndConditions || !termsPolicy))
            }
            className="next"
            iconAfter={
              formik.values.type_work ||
              (formik.values.type_home_assistent && (
                <CustomIcon icon="arrow-right" marginLeft="7px" />
              ))
            }
            description={
              formik.values.type_user &&
              !formik.values.type_work &&
              !formik.values.type_home_assistent
                ? formik.values.id === 0
                  ? "Cadastrar"
                  : "Alterar"
                : "Continuar"
            }
          />
        </Box>
      )}
    </MyForm>
  );
};

export default PessonalIdentification;

const MyForm = styled.form`
  padding: 2em 0;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 1em 0;
  }
`;

const Grid = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  border-bottom: 2px solid #eee;
  padding: 1em;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: ${(props) =>
      `repeat(auto-fill, minmax(calc(${props.width}px - 2em), 1fr))`};
    padding-left: 0;
    padding-right: 0;
  }
`;

const CustomIcon = styled(Icon)`
  cursor: pointer;
  :hover,
  :focus {
    opacity: 0.8;
  }
`;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;
