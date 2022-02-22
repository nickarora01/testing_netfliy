import { Box, Input, Textarea } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { Rifm } from "rifm";
import styled from "styled-components";
import useWindowSize from "../../hooks/useWIndowSize";
import { formatDate, formatNIF, formatZip } from "../../utils/helper";
import MyInput from "./MyInput";
import MyRadio from "./MyRadio";
import districtJson from "../../json/portugal_district.json";
import MySelect from "./MySelect";
import { Checkbox as EverCheckbox, Icon } from "evergreen-ui";
import { useStore } from "easy-peasy";
import MyButton from "./MyButton";
import ContextSelect from "../ContextSelect";
import { useActions } from "../../configureStore";
import categories from "../../models/categories";

const ProfessionalsInformation = (props) => {
  const { width } = useWindowSize();
  const {
    values,
    nextStep,
    save,
    payloader,
    typeRegister,
    edit,
    _formik,
  } = props;

  const setIsSuccess = useActions((action) => action.auth.setIsSuccess);
  const isSuccess = useStore((state) => state.auth.isSuccess);

  const isAuth = useStore((state) => state.auth.isAuthenticated);

  const _type = values?.user_info?.type || typeRegister;

  let formik = useFormik({
    initialValues: {
      type: _type,
      type_work: values?.user_info?.type_work || _type === 2,
      type_user: values?.user_info?.type_user || _type === 1,
      type_home_assistent:
        values?.user_info?.type_home_assistent || _type === 3,
      categories: values?.user_info?.category_ids || [],
      where_you_work: values?.user_info?.region_work || "",
      indication_code: values?.indication_code || "",
      region_serve_customers: values?.user_info?.region_work || "",
      not_become: true,
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const auth = JSON.parse(localStorage.getItem("4you_auth"));
      const payload = payloader(values);
      await save({ payload, id: auth?.user?.id || 0, step: 2, edit: false });
      setSubmitting(false);
    },
    validate: (values) => {
      const err = {};
      const message = "Campo obrigatório";

      if (_type === 2) {
        if (values.categories?.length === 0) err.categories = message;
        if (!values.where_you_work) err.where_you_work = message;
      }

      if (_type === 3) {
        if (!values.region_serve_customers)
          err.region_serve_customers = message;
      }

      if (!values.indication_code) err.indication_code = message;

      return err;
    },
  });

  formik = edit ? _formik : formik;

  return (
    <MyForm onSubmit={formik.handleSubmit} autocomplete="off">
      {formik.values.type_work && (
        <Grid width={width}>
          <Box>
            <ContextSelect
              invalid={
                formik.errors.categories &&
                formik.touched.categories &&
                formik.errors.categories
              }
              formik={formik}
              categoriesIds={formik.values.categories}
            />
            <MessageError>
              {formik.errors.categories &&
                formik.touched.categories &&
                formik.errors.categories}
            </MessageError>
          </Box>
          <MyInput
            isInvalid={
              !!formik.errors.where_you_work &&
              formik.touched.where_you_work &&
              !!formik.errors.where_you_work
            }
            err={
              formik.errors.where_you_work &&
              formik.touched.where_you_work &&
              formik.errors.where_you_work
            }
            label="Região onde pretende trabalhar"
            placeholderTemplate="Insira a"
            name="where_you_work"
            value={formik.values.where_you_work}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            infoMessage="Pode informar mais de uma região. Esta informação é fundamental para que o contratante encontre seu perfil"
          />
        </Grid>
      )}
      {formik.values.type_home_assistent && (
        <Grid width={width}>
          <MyInput
            isInvalid={
              !!formik.errors.region_serve_customers &&
              formik.touched.region_serve_customers &&
              !!formik.errors.region_serve_customers
            }
            err={
              formik.errors.region_serve_customers &&
              formik.touched.region_serve_customers &&
              formik.errors.region_serve_customers
            }
            label="Região onde pretende atender clientes"
            placeholderTemplate="Insira a"
            name="region_serve_customers"
            value={formik.values.region_serve_customers}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Grid>
      )}
      <Grid width={width}>
        <MyInput
          isInvalid={
            !!formik.errors.indication_code &&
            formik.touched.indication_code &&
            !!formik.errors.indication_code
          }
          err={
            formik.errors.indication_code &&
            formik.touched.indication_code &&
            formik.errors.indication_code
          }
          disabled={edit && formik.values.not_become}
          label="código indicação"
          placeholderTemplate="Insira o"
          name="indication_code"
          value={formik.values.indication_code}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Necessário para manter a qualidade e a confiabilidade dos profissionais cadastrados. Se ainda não tem o código, faça contato pelo e-mail contato@homeassist4u.com. Seu perfil será avaliado antes de enviarmos o código para sua inscrição"
        />
      </Grid>
      {!edit && (
        <Box padding={"1em"} display={"flex"}>
          <MyButton
            disabled={formik.isSubmitting || !isAuth}
            className="next"
            iconAfter={<CustomIcon icon="arrow-right" marginLeft="7px" />}
            description="Continuar"
          />
        </Box>
      )}
    </MyForm>
  );
};

export default ProfessionalsInformation;

const MyForm = styled.form`
  padding: 2rem 0;
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

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

const CustomIcon = styled(Icon)`
  cursor: pointer;
  :hover,
  :focus {
    opacity: 0.8;
  }
`;
