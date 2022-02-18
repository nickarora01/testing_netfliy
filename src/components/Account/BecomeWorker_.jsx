import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { formatToDate } from "brazilian-values";
import {
  Box,
  Button,
  Input,
  Textarea,
  Spinner,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { withRouter } from "react-router-dom";
import { CloseIcon } from "@chakra-ui/icons";

import { useStore, useActions } from "../../configureStore";
import { RadioGroup } from "evergreen-ui";
import { theme } from "../../theme";
import useWindowSize from "../../hooks/useWIndowSize";
import { useFormik } from "formik";
import ContextSelect from "../ContextSelect";
import { Upload } from "../../utils/upload";
import CvIcon from "../../assets/icons/file.svg";
import { parseToDate } from "brazilian-values";
import { Rifm } from "rifm";
import {
  changeNameDays,
  formatDate,
  formatFile,
  downloadFile,
} from "../../utils/helper";
import languages from "../../utils/languages";
import { remove } from "lodash";
import NoUser from "../../assets/icons/nouser.svg";
import DocumentIcon from "../../assets/icons/driver-license.svg";
import { PasswordTest } from "../utils/helper";

const MyInput = (props) => {
  const { width } = useWindowSize();

  return (
    <Box
      width={props.boxWidth ? props.boxWidth : "100%"}
      marginBottom={width <= 1024 ? "1rem" : width <= 440 ? "2rem" : "0rem"}
    >
      <Label>{props.label}</Label>
      {props.area ? <CustomTextArea {...props} /> : <CustomInput {...props} />}
      <MessageError>{props.err ? props.err : " "}</MessageError>
    </Box>
  );
};

const BecomeWorker = (props) => {
  const isAuth = useStore((state) => state.auth.isAuthenticated);
  const [termsPolicy] = useState(false);
  const [termsAndConditions] = useState(false);
  const { width } = useWindowSize();
  const [loadingCv, setLoadingCv] = useState(false);
  const getMe = useActions((action) => action.user.getMe);
  const [payment] = useState(props.data?.user_info?.payment?.toString() || "1");
  const updateProfile = useActions((action) => action.user.updateProfile);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingImageDocument, setLoadingImageDocument] = useState(false);
  const [loadingImageDocument2, setLoadingImageDocument2] = useState(false);

  const doUpload = async (e) => {
    e.preventDefault();
    setLoadingImageDocument(true);
    const fileName = await Upload("users/document", e.target.files[0]);
    formik.setFieldValue("document_image", fileName);
    formik.setSubmitting(false);

    setTimeout(() => {
      setLoadingImageDocument(false);
      getMe();
    }, 2000);
  };

  const doUpload2 = async (e) => {
    e.preventDefault();
    setLoadingImageDocument2(true);
    const fileName = await Upload("users/document", e.target.files[0]);
    formik.setFieldValue("document_image2", fileName);
    formik.setSubmitting(false);

    setTimeout(() => {
      setLoadingImageDocument2(false);
      getMe();
    }, 2000);
  };

  const doUploadImageUser = async (e) => {
    e.preventDefault();
    setLoadingImage(true);
    const fileName = await Upload("users", e.target.files[0]);
    formik.setFieldValue("photo", fileName);
    formik.setSubmitting(false);

    setTimeout(() => {
      setLoadingImage(false);
      getMe();
    }, 2000);
  };

  const doUploadCv = async (e) => {
    e.preventDefault();
    setLoadingCv(true);
    const fileName = await Upload("cv", e.target.files[0]);
    formik.setFieldValue("cv_link", fileName);
    formik.setSubmitting(false);

    setTimeout(() => {
      setLoadingCv(false);
      getMe();
    }, 2000);
  };

  const formik = useFormik({
    initialValues: {
      type: parseInt(props.data?.user_info?.type),
      name: props.data?.name || "",
      gender: props.data?.gender || "1",
      country_born: props.data?.user_info?.country_born || "",
      city_born: props.data?.user_info?.city_born || "",
      rg: props.data?.user_info?.rg || "",
      uf: props.data?.user_info?.rg_emissor || "",
      document_image: props.data?.user_info?.document_image || null,
      document_image2: props.data?.user_info?.document_image2 || null,
      zipcode: parseInt(props.data?.address?.zipcode) || "",
      street: props.data?.address?.street || "",
      number: props.data?.address?.number || "",
      complement: props.data?.address?.complement || "",
      district: props.data?.address?.district || "",
      city: props.data?.address?.city || "",
      country: props.data?.address?.country || "",
      date_born:
        (props.data?.birthday?.length > 0 &&
          formatToDate(new Date(props.data?.birthday))) ||
        "",
      cpf: props.data?.user_info?.cpf || "",
      user_available_times: props.data?.user_available_times || {},
      photo: props.data?.image || null,
      has_social_link:
        props.data?.user_info?.has_social_link?.toString() || "false",
      can_share_social_link:
        props.data?.user_info?.can_share_social_link?.toString() || "false",
      facebook_link: props.data?.user_info?.facebook_link || "",
      instagram_link: props.data?.user_info?.instagram_link || "",
      linkedin_link: props.data?.user_info?.linkedin_link || "",
      twitter_link: props.data?.user_info?.twitter_link || "",
      drivers_license:
        props.data?.user_info?.car_permission?.toString() || "false",
      remuneration_price:
        parseFloat(props.data?.user_info?.remuneration_price) || "",
      remuneration_type:
        parseInt(props.data?.user_info?.remuneration_type) || 1,
      living_with_pets:
        props.data?.user_info?.animal_coexistence?.toString() || "true",
      smoker: props.data?.user_info?.smoking?.toString() || "false",
      user_language: props.data?.user_language || [],
      payment: payment,
      father_name: props.data?.user_info?.father_name || "",
      mother_name: props.data?.user_info?.mother_name || "",
      where_you_work: props.data?.user_info?.region_work || "",
      experience_description: props.data?.user_info?.experience || "",
      experience_time: props.data?.user_info?.time_experience || "",
      completed_courses: props.data?.user_info?.courses || "",
      note: props.data?.user_info?.note || "",
      lang: props.data?.user_language[0]?.language || "",
      arr_available_times: [],
      time_available: "",
      time_in: "",
      time_until: "",
      indication_code: props.data?.indication_code,
      phone1: props.data?.user_info?.phone1 || "",
      email: props.data?.email || "",
      password: "",
      categories: props.data?.user_info?.category_ids || [],
      schooling: props.data?.user_info?.schooling || "",
      cv_link: props.data?.user_info?.cv_link || "",
      type_home_assistent: props.data?.user_info?.type_home_assistent,
      type_user: props.data?.user_info?.type_user,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const newAvailableTimes = values.arr_available_times.map((item) => {
        const work = item.day;
        const time = `${item.time_in} às ${item.time_until}`;
        const label = item.day.replace("work", "time");
        return {
          [work]: true,
          [label]: time,
        };
      });

      let objAvailableTimes = {};

      newAvailableTimes.map((item) => {
        Object.assign(objAvailableTimes, item);
      });

      let arrCategoriesIds = [];
      const mapCategories = values.categories?.map((item) => {
        if (isNaN(item)) {
          arrCategoriesIds.push(item.value);
        } else {
          arrCategoriesIds.push(item);
        }
        return arrCategoriesIds;
      });

      await updateProfile({
        profile: {
          name: values.name,
          email: values.email,
          gender: values.gender,
          image: values.photo,
          birthday: parseToDate(values.date_born),
          indication_code: values.indication_code,
        },
        user_info: {
          phone1: values.phone1,
          country_born: values.country_born,
          city_born: values.city_born,
          region_work: values.where_you_work,
          has_social_link: values.has_social_link?.includes("true")
            ? true
            : false,
          can_share_social_link: values.can_share_social_link?.includes("true")
            ? true
            : false,
          facebook_link: values.facebook_link,
          instagram_link: values.instagram_link,
          linkedin_link: values.linkedin_link,
          twitter_link: values.twitter_link,
          car_permission: values.drivers_license?.includes("true")
            ? true
            : false,
          remuneration_type: parseInt(values.remuneration_type),
          remuneration_price: parseFloat(values.remuneration_price),
          animal_coexistence: values.living_with_pets?.includes("true")
            ? true
            : false,
          smoking: values.smoker?.includes("true") ? true : false,
          experience: values.experience_description,
          time_experience: values.experience_time,
          courses: values.completed_courses,
          schooling: values.schooling,
          cv_link: values.cv_link,
          note: values.note,
          type: values.type,
          type_work: true,
          type_user: values.type_user,
          type_home_assistent: values.type_home_assistent,
          payment: parseInt(payment),
          category_ids: arrCategoriesIds,
          document_image: values.document_image,
          document_image2: values.document_image2,
          mother_name: values.mother_name,
          father_name: values.father_name,
        },
        available: objAvailableTimes,
        address: {
          street: values.street,
          number: parseInt(values.number),
          district: values.district,
          state: values.state,
          city: values.city,
          country: values.country,
          zipcode: values.zipcode.toString(),
          complement: values.complement,
        },
        user_language: values.user_language,
      });

      setSubmitting(false);
      props.onClose();
    },
    validate: (values) => {
      const err = {};
      const message = "Campo obrigatório";

      if (!values.name) err.name = message;
      if (!props.data?.id && !PasswordTest(values.password))
        err.password =
          "Senha deve conter letras maiúsculas e minúsculas, números e caracteres especiais (@$!%*?&#)";
      if (!values.email) err.email = message;
      if (!values.phone1) err.phone1 = message;
      if (!values.cpf) err.cpf = message;
      if (!values.rg) err.rg = message;
      if (!values.uf) err.uf = message;
      if (!values.payment) err.payment = message;
      if (!values.street) err.street = message;
      if (!values.number) err.number = message;
      if (!values.district) err.district = message;
      // if (!values.city) err.city = message;
      if (!values.country) err.country = message;
      if (!values.zipcode) err.zipcode = message;
      if (!values.country_born) err.country_born = message;
      if (!values.city_born) err.city_born = message;
      if (!values.date_born) err.date_born = message;
      if (!values.where_you_work) err.where_you_work = message;
      if (values.arr_available_times?.length === 0) {
        err.arr_available_times = message;
      }

      if (values.arr_available_times?.length > 0) {
        for (let i = 0; i < values.arr_available_times.length; i++) {
          const item = values.arr_available_times[i];
          if (!item.time_in || !item.time_until) {
            err.arr_available_times = message;
          }
        }
      }
      if (!values.lang) err.lang = message;
      if (!values.father_name) err.father_name = message;
      if (!values.mother_name) err.mother_name = message;
      if (!values.experience_description) err.experience_description = message;
      if (!values.experience_time) err.experience_time = message;
      if (!values.schooling) err.schooling = message;
      if (values.categories?.length === 0) err.categories = message;
      if (
        !props.data?.user_info?.indication_accepted &&
        !values.indication_code
      )
        err.indication_code = message;

      if (!values.document_image) err.document_image = message;
      if (!values.photo) err.photo = message;

      return err;
    },
  });

  useEffect(() => {
    if (props.data) {
      const daysWork = Object.keys(formik.values.user_available_times)?.filter(
        (item) => {
          return item?.includes("work");
        }
      );

      let daysTrue = [];

      daysWork.filter((item) => {
        if (formik.values.user_available_times[item] === true) {
          daysTrue.push(item?.replace("_work", "_time"));
        }
      });

      let newDays = [];

      for (const item of daysTrue) {
        if (item !== "working_days") {
          let breakVal = formik.values.user_available_times?.[item]?.split(" ");
          newDays.push({
            day: item?.replace("time", "work"),
            time_in: breakVal[0],
            time_until: breakVal[2],
          });
        } else {
          newDays.push({
            day: "working_days",
            time_in: 8,
            time_until: 18,
          });
        }
      }

      formik.setFieldValue("arr_available_times", newDays);
    }
  }, [props.data]);

  let userLang = [...formik.values.user_language];
  let userAvailableTimes = [...formik.values.arr_available_times];

  const dates = [
    { value: "working_days", name: "Dias Úteis" },
    { value: "sunday_work", name: "Domingo" },
    { value: "monday_work", name: "Segunda-feira" },
    { value: "tuesday_work", name: "Terça-feira" },
    { value: "wednesday_work", name: "Quarta-feira" },
    { value: "thursday_work", name: "Quinta-feira" },
    { value: "friday_work", name: "Sexta-feira" },
    { value: "saturday_work", name: "Sábado" },
  ];

  return (
    <MyForm onSubmit={formik.handleSubmit} autocomplete="off">
      <FlexCustom>
        {!props.data?.user_info?.indication_accepted && (
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
            label="Insira o código de indicação"
            name="indication_code"
            value={formik.values.indication_code}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        )}
        <Box>
          <Label>Genêro</Label>
          <CustomRadio
            name="gender"
            value={formik.values.gender}
            options={[
              { label: "Feminino", value: "1" },
              { label: "Masculino", value: "2" },
              { label: "Outros", value: "3" },
            ]}
            onChange={(value) => formik.setFieldValue("gender", value)}
          />
        </Box>
        <MyInput
          isInvalid={
            !!formik.errors.city_born &&
            formik.touched.city_born &&
            !!formik.errors.city_born
          }
          err={
            formik.errors.city_born &&
            formik.touched.city_born &&
            formik.errors.city_born
          }
          label="Distrito onde nasceu"
          name="city_born"
          value={formik.values.city_born}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <MyInput
          isInvalid={
            !!formik.errors.country_born &&
            formik.touched.country_born &&
            !!formik.errors.country_born
          }
          err={
            formik.errors.country_born &&
            formik.touched.country_born &&
            formik.errors.country_born
          }
          label="País onde nasceu"
          name="country_born"
          value={formik.values.country_born}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
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
          placeholder=""
          name="where_you_work"
          value={formik.values.where_you_work}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Box>
          <Box marginBottom={"1rem"} display="flex" alignItems="flex-end">
            <Box width="100%">
              <Label>Datas/horários disponíveis</Label>
              <CustomSelect
                width="100%"
                placeholder="Datas/horários disponíveis"
                onChange={(e) => {
                  if (
                    !!userAvailableTimes.find(
                      (item) => item.day === e.target.value
                    ) === false
                  ) {
                    userAvailableTimes.push({
                      day: e.target.value,
                      time_in: "",
                      time_until: "",
                    });
                    formik.setFieldValue("time_available", e.target.value);
                  }
                  formik.setFieldValue(
                    "arr_available_times",
                    userAvailableTimes
                  );
                }}
              >
                {dates?.map((item, idx) => (
                  <option value={item.value} key={idx}>
                    {item.name}
                  </option>
                ))}
              </CustomSelect>
              <MessageError>
                {formik.errors.arr_available_times &&
                formik.touched.arr_available_times
                  ? formik.errors.arr_available_times
                  : ""}
              </MessageError>
            </Box>
          </Box>
          {userAvailableTimes?.map((item, idx) => (
            <WrapUnavailableTimes key={idx}>
              <Box width={"100px"} fontSize=".9rem" marginRight="1rem">
                {changeNameDays(item?.day)}
              </Box>
              <Box
                display="flex"
                alignItems={width <= 440 ? "center" : "center"}
              >
                <MyInput
                  disabled={item.time_in?.length > 0}
                  boxWidth={"30% !important"}
                  width={"50% !important"}
                  label="De"
                  placeholder="ex: 9h"
                  name="time_in"
                  value={item.time_in}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <MyInput
                  disabled={item.time_until?.length > 0}
                  boxWidth={"30% !important"}
                  width={"50% !important"}
                  label="Até"
                  placeholder="ex: 19h"
                  name="time_until"
                  value={item.time_until}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                <Button
                  as="div"
                  type="any"
                  textAlign="center"
                  display={item.time_in?.length > 0 ? "none" : "flex"}
                  marginTop={width <= 440 ? "-1.1rem" : "0"}
                  minWidth="70px"
                  disabled={item.show}
                  onClick={() => {
                    if (
                      formik.values.time_available?.length > 0 &&
                      formik.values.time_in?.length > 0 &&
                      formik.values.time_until?.length > 0
                    ) {
                      item.time_in = formik.values.time_in;
                      item.time_until = formik.values.time_until;
                      item.show = true;
                      item.value = `${item.time_in} às ${item.time_until}`;

                      formik.setFieldValue(
                        "arr_available_times",
                        userAvailableTimes
                      );
                    }
                  }}
                  height="48px"
                  cursor="pointer"
                  style={{
                    backgroundColor: theme.color.white,
                    border: `2px solid ${theme.color.green}`,
                    color: theme.color.green,
                    fontSize: ".8rem",
                  }}
                >
                  {item.show ? "Salvo" : "Salvar"}
                </Button>
                <DeleteBtn
                  marginTop={width <= 440 ? "-1.1rem" : "0"}
                  marginLeft={item.time_in?.length > 0 ? "0" : "1rem"}
                  paddingBottom=".5rem"
                  paddingLeft=".5rem"
                  aria-label="remove"
                  name="close"
                  onClick={() => {
                    let arr = userAvailableTimes;
                    remove(arr, arr[idx]);
                    formik.setFieldValue("arr_available_times", arr);
                  }}
                />
              </Box>
            </WrapUnavailableTimes>
          ))}
        </Box>
        <Box>
          <Label>Carta Condução</Label>
          <CustomRadio
            value={formik.values.drivers_license}
            options={[
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            name="drivers_license"
            onChange={(value) => formik.setFieldValue("drivers_license", value)}
          />
        </Box>
        <Box>
          <Col>
            <Label>Remuneração Pretendida</Label>
            <CustomRadio
              name="type"
              value={parseInt(formik.values?.remuneration_type)}
              options={[
                { label: "Hora", value: 1 },
                { label: "Diária", value: 2 },
                { label: "Mensal", value: 3 },
              ]}
              onChange={(event) =>
                formik.setFieldValue("remuneration_type", event.target.value)
              }
            />
          </Col>
          <MyInput
            type="number"
            width={
              width === 1024
                ? "80% !important"
                : width >= 1280 && "87% !important"
            }
            placeholder={"Valor"}
            name="remuneration_price"
            value={formik.values.remuneration_price}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        </Box>
        <Box>
          <Label>Convivência com animais de estimação</Label>
          <CustomRadio
            name="living_with_pets"
            value={formik.values.living_with_pets}
            options={[
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            onChange={(value) =>
              formik.setFieldValue("living_with_pets", value)
            }
          />
        </Box>
        <Box>
          <Label>Fumante</Label>
          <CustomRadio
            name="smoker"
            value={formik.values.smoker}
            options={[
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            onChange={(value) => formik.setFieldValue("smoker", value)}
          />
        </Box>
        <Box marginBottom={"1rem"}>
          <Box>
            <Box display="flex" alignItems="flex-end">
              <Box>
                <Label>Idiomas</Label>
                <CustomSelect
                  width="95%"
                  placeholder="Selecione um idioma"
                  onChange={(e) => formik.setFieldValue("lang", e.target.value)}
                >
                  {languages?.map((item, idx) => (
                    <option key={idx} value={item.name}>
                      {item.name}
                    </option>
                  ))}
                </CustomSelect>
              </Box>
              <Button
                as="div"
                type="any"
                onClick={() => {
                  if (
                    formik.values.lang?.length > 0 &&
                    !!userLang.find(
                      (item) => item.language === formik.values.lang
                    ) === false
                  ) {
                    userLang.push({
                      language: formik.values.lang,
                      read: false,
                      write: false,
                      listening: false,
                    });
                    formik.setFieldValue("user_language", userLang);
                  }
                }}
                width={width <= 440 ? "150px" : "auto"}
                height="48px"
                cursor="pointer"
                style={{
                  backgroundColor: theme.color.white,
                  border: `2px solid ${theme.color.green}`,
                  color: theme.color.green,
                  fontSize: ".8rem",
                }}
              >
                Adicionar
              </Button>
            </Box>
            <MessageError>
              {formik.errors.lang && formik.touched.lang
                ? formik.errors.lang
                : ""}
            </MessageError>
          </Box>
          {userLang?.map((item, idx) => (
            <Box
              paddingY={".5rem"}
              display="flex"
              alignItems={width <= 440 ? "flex-start" : "center"}
              key={idx}
              flexDirection={width <= 440 ? "column" : "row"}
            >
              <Box>{item?.language}</Box>
              <Box
                display="flex"
                alignItems="center"
                marginLeft={width <= 440 ? "0rem" : "1rem"}
              >
                <CustomCheckbox
                  marginLeft={0}
                  isChecked={item.read}
                  onChange={() => {
                    let arr = userLang;
                    arr[idx].read = !arr[idx]?.read;
                    formik.setFieldValue("user_language", arr);
                  }}
                >
                  Lê
                </CustomCheckbox>
                <CustomCheckbox
                  isChecked={item.write}
                  onChange={(e) => {
                    let arr = userLang;
                    arr[idx].write = !arr[idx]?.write;
                    formik.setFieldValue("user_language", arr);
                  }}
                >
                  Fala
                </CustomCheckbox>
                <CustomCheckbox
                  isChecked={item.listening}
                  onChange={(e) => {
                    let arr = userLang;
                    arr[idx].listening = !arr[idx]?.listening;
                    formik.setFieldValue("user_language", arr);
                  }}
                >
                  Entende
                </CustomCheckbox>
                <DeleteBtn
                  aria-label="remove"
                  name="close"
                  onClick={() => {
                    let arr = userLang;
                    remove(arr, arr[idx]);
                    formik.setFieldValue("user_language", arr);
                  }}
                />
              </Box>
            </Box>
          ))}
        </Box>
        <Box marginTop={"1rem"}>
          <MyInput
            area={true}
            row={5}
            width={
              width === 1024
                ? "80% !important"
                : width >= 1280 && "97% !important"
            }
            name="note"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.note}
            placeholder="Anotações Pessoais"
            label="Anotações Pessoais"
          />
        </Box>
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
            {formik.errors.categories && formik.touched.categories
              ? formik.errors.categories
              : ""}
          </MessageError>
        </Box>
        <MyInput
          isInvalid={
            !!formik.errors.father_name &&
            formik.touched.father_name &&
            !!formik.errors.father_name
          }
          err={
            formik.errors.father_name &&
            formik.touched.father_name &&
            formik.errors.father_name
          }
          value={formik.values.father_name}
          name="father_name"
          label="Nome do pai"
          placeholder="Nome do pai"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <MyInput
          isInvalid={
            !!formik.errors.mother_name &&
            formik.touched.mother_name &&
            !!formik.errors.mother_name
          }
          err={
            formik.errors.mother_name &&
            formik.touched.mother_name &&
            formik.errors.mother_name
          }
          name="mother_name"
          label="Nome da mãe"
          placeholder="Nome da mãe"
          value={formik.values.mother_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <MyInput
          isInvalid={
            !!formik.errors.experience_description &&
            formik.touched.experience_description &&
            !!formik.errors.experience_description
          }
          err={
            formik.errors.experience_description &&
            formik.touched.experience_description &&
            formik.errors.experience_description
          }
          label="Descrição da Experiência"
          placeholder=""
          name="experience_description"
          value={formik.values.experience_description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <MyInput
          isInvalid={
            !!formik.errors.experience_time &&
            formik.touched.experience_time &&
            !!formik.errors.experience_time
          }
          err={
            formik.errors.experience_time &&
            formik.touched.experience_time &&
            formik.errors.experience_time
          }
          label="Tempo de experiência"
          placeholder=""
          name="experience_time"
          value={formik.values.experience_time}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <MyInput
          isInvalid={
            !!formik.errors.completed_courses &&
            formik.touched.completed_courses &&
            !!formik.errors.completed_courses
          }
          err={
            formik.errors.completed_courses &&
            formik.touched.completed_courses &&
            formik.errors.completed_courses
          }
          label="Cursos realizados"
          placeholder=""
          name="completed_courses"
          value={formik.values.completed_courses}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        {formik.values.photo?.length > 0 ? (
          <Col>
            <Label>Foto de perfil</Label>
            <BoxAvatar>
              <Box width="100%" height="100%" position="relative">
                <InputImage
                  type="file"
                  onChange={(e) => doUploadImageUser(e)}
                  accept="image/*"
                />
                {loadingImage ? (
                  <LoadingImage>
                    <Spinner />
                  </LoadingImage>
                ) : (
                  <ImageProduct
                    src={`${process.env.REACT_APP_ASSETS_BUCKET}/users/${formik.values.photo}`}
                  />
                )}
              </Box>
            </BoxAvatar>
          </Col>
        ) : (
          <Col>
            <Label>Foto de perfil</Label>
            <BoxAvatar style={{ backgroundColor: "#fff" }}>
              <Box width="100%" height="100%" position="relative">
                <InputImage
                  type="file"
                  onChange={(e) => doUploadImageUser(e)}
                  accept="image/*"
                />
                {loadingImage ? (
                  <LoadingImage>
                    <Spinner />
                  </LoadingImage>
                ) : (
                  <ImageProduct src={NoUser} />
                )}
              </Box>
            </BoxAvatar>
            <MessageError>{formik.errors.photo}</MessageError>
          </Col>
        )}
        <Col marginTop="2rem">
          <Label>Tem perfil nas redes sociais?</Label>
          <CustomRadio
            name="has_social_link"
            value={formik.values.has_social_link}
            options={[
              { label: "Sim", value: "true" },
              { label: "Não", value: "false" },
            ]}
            onChange={(value) => formik.setFieldValue("has_social_link", value)}
          />
          {formik.values.has_social_link === "true" && (
            <Box marginTop="1rem">
              <Label>Aceita que seja divulgado?</Label>
              <CustomRadio
                name="can_share_social_link"
                value={formik.values.can_share_social_link}
                options={[
                  { label: "Sim", value: "true" },
                  { label: "Não", value: "false" },
                ]}
                onChange={(value) =>
                  formik.setFieldValue("can_share_social_link", value)
                }
              />
            </Box>
          )}
          {formik.values.has_social_link === "true" &&
            formik.values.can_share_social_link === "true" && (
              <Box marginTop="1rem">
                <Label>Se sim, qual o link do perfil?</Label>
                <Col>
                  <MyInput
                    width={width >= 1024 ? "94% !important" : "90% !important"}
                    placeholder="link do facebook"
                    name="facebook_link"
                    value={formik.values.facebook_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <MyInput
                    width={width >= 1024 ? "94% !important" : "90% !important"}
                    placeholder="link do instagram"
                    name="instagram_link"
                    value={formik.values.instagram_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <MyInput
                    width={width >= 1024 ? "94% !important" : "90% !important"}
                    placeholder="link do linkedin"
                    name="linkedin_link"
                    value={formik.values.linkedin_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <MyInput
                    width={width >= 1024 ? "94% !important" : "90% !important"}
                    placeholder="link do twitter"
                    name="twitter_link"
                    value={formik.values.twitter_link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </Col>
              </Box>
            )}
        </Col>
        <Box display="flex" alignItems="flex-end">
          {formik.values.document_image?.length > 0 ? (
            <Col>
              <Label>Foto do Documento</Label>
              <BoxAvatar>
                <Box width="100%" height="100%" position="relative">
                  <InputImage
                    type="file"
                    onChange={(e) => doUpload(e)}
                    accept="image/*, .pdf"
                  />
                  {loadingImageDocument ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct
                      src={`${process.env.REACT_APP_ASSETS_BUCKET}/users/document/${formik.values.document_image}`}
                    />
                  )}
                </Box>
              </BoxAvatar>
            </Col>
          ) : (
            <Col>
              <Label>Foto do Documento</Label>
              <BoxAvatar style={{ backgroundColor: "#fff" }}>
                <Box width="100%" height="100%" position="relative">
                  <InputImage
                    type="file"
                    onChange={(e) => doUpload(e)}
                    accept="image/*, .pdf"
                  />
                  {loadingImageDocument ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct src={DocumentIcon} />
                  )}
                </Box>
              </BoxAvatar>
              <MessageError>{formik.errors.document_image}</MessageError>
            </Col>
          )}

          {formik.values.document_image2?.length > 0 ? (
            <Col>
              <BoxAvatar>
                <Box width="100%" height="100%" position="relative">
                  <InputImage
                    type="file"
                    onChange={(e) => doUpload2(e)}
                    accept="image/*, .pdf"
                  />
                  {loadingImageDocument2 ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct
                      src={`${process.env.REACT_APP_ASSETS_BUCKET}/users/document/${formik.values.document_image2}`}
                    />
                  )}
                </Box>
              </BoxAvatar>
            </Col>
          ) : (
            <Col>
              <BoxAvatar style={{ backgroundColor: "#fff" }}>
                <Box width="100%" height="100%" position="relative">
                  <InputImage
                    type="file"
                    onChange={(e) => doUpload2(e)}
                    accept="image/*, .pdf"
                  />
                  {loadingImageDocument2 ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct src={DocumentIcon} />
                  )}
                </Box>
              </BoxAvatar>
              <MessageError>{formik.errors.document_image2}</MessageError>
            </Col>
          )}
        </Box>
        <MyInput
          isInvalid={
            !!formik.errors.schooling &&
            formik.touched.schooling &&
            !!formik.errors.schooling
          }
          err={
            formik.errors.schooling &&
            formik.touched.schooling &&
            formik.errors.schooling
          }
          width={width >= 1024 ? "94% !important" : "90% !important"}
          label="Nível Educacional"
          placeholder="Nível Educacional"
          name="schooling"
          value={formik.values.schooling}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Col>
          <Label>Anexar CV (Opcional)</Label>
          <BoxAvatar style={{ backgroundColor: "#fff" }}>
            <Box width="100%" height="100%" position="relative">
              <InputImage
                type="file"
                onChange={(e) => doUploadCv(e)}
                accept="image/*, .pdf, .docx"
              />
              {loadingCv ? (
                <LoadingImage>
                  <Spinner />
                </LoadingImage>
              ) : (
                <ImageProduct
                  opacity={formik.values.cv_link?.length > 0 ? 1 : 0.7}
                  src={CvIcon}
                />
              )}
            </Box>
          </BoxAvatar>
          <Box marginTop="1rem">{formatFile(formik.values.cv_link)}</Box>
        </Col>
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
          onClick={() => {
            if (!formik.isValid)
              props.modalBodyRef.current.scrollTo({
                top: 0,
                behavior: "smooth",
              });
          }}
        >
          {formik.isSubmitting ? "Salvando" : "Confirmar"}
        </Button>
      </FlexCustom>
    </MyForm>
  );
};

export default withRouter(BecomeWorker);

const MyForm = styled.form`
  padding-top: 2rem;
`;

const FlexCustom = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;

const CustomInput = styled(Input)`
  margin-top: 0.1rem;
  width: 94% !important;
  border: 2px solid #eee !important;
  height: 45px !important;
  :disabled {
    opacity: 0.8 !important;
  }
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    width: 90% !important;
  }
`;

const CustomTextArea = styled(Textarea)`
  margin-top: 0.1rem;
  width: 94% !important;
  border: 2px solid #eee !important;
  height: 45px !important;
  :disabled {
    opacity: 0.8 !important;
  }
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    width: 90% !important;
  }
`;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

const Col = styled(Box)`
  display: flex;
  flex-direction: column;
`;

const BoxAvatar = styled.div`
  width: 120px;
  height: 120px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease 0s;
  &:hover {
    opacity: 0.7;
  }
`;
const InputImage = styled.input`
  position: absolute;
  opacity: 0;
  width: 60px;
  height: 60px;
  cursor: pointer;
  z-index: 1;
  top: 0;
  left: 0;
`;

const LoadingImage = styled.div`
  width: 120px;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;

const ImageProduct = styled.img`
  margin-top: 0.5rem;
  width: 60px;
  height: 60px;
  object-fit: cover;
  opacity: ${(props) => props.opacity};
`;

const CustomSelect = styled(Select)`
  height: 50px !important;
  border: 2px solid #eee !important;
`;

const WrapUnavailableTimes = styled(Box)`
  margin: 0.5rem 0;
  display: flex;
  align-items: center;
  width: 100%;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;
const DeleteBtn = styled(CloseIcon)`
  border: none !important;
  margin-left: 1rem;
  height: 35px !important;
  cursor: pointer;
  path {
    fill: ${(props) => props.theme.color.red};
  }
`;
const CustomRadio = styled(RadioGroup)`
  min-width: 200px;
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

const CustomCheckbox = styled(Checkbox)`
  margin-left: 1rem;
  .css-nlndso {
    color: #eee;
  }
  border-color: lightgray;
`;
