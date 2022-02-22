import React, { useState, useEffect } from "react";
import {
  Box,
  Spinner,
  Input,
  Checkbox,
  Button,
  Select,
  Icon,
  Textarea,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";
import { RadioGroup } from "evergreen-ui";
import { useFormik } from "formik";
import styled from "styled-components";
import { remove } from "lodash";
import { parseToDate, formatToDate } from "brazilian-values";
import { Rifm } from "rifm";
import ReactSelect from "react-select";
import HelpPdf from "../assets/pdf/Ajuda.pdf";
import languages from "../utils/languages";
import { Upload } from "../utils/upload";
import {
  changeNameDays,
  formatDate,
  formatNIF,
  formatZip,
} from "../utils/helper";
import { useStore, useActions } from "../configureStore";
import NoUser from "../assets/icons/nouser.svg";
import DocumentIcon from "../assets/icons/driver-license.svg";
import { theme } from "../theme";
import useWindowSize from "../hooks/useWIndowSize";
import districtJson from "../json/portugal_district.json";
import { PasswordTest } from "../utils/helper";

const MyInput = (props) => {
  const { width } = useWindowSize();

  return (
    <Box
      width={props.boxWidth ? props.boxWidth : "100%"}
      marginBottom={width <= 1024 ? "1rem" : width <= 440 ? "2rem" : "0rem"}
    >
      <Label>{props.label}</Label>
      {props.area ? (
        <CustomTextArea {...props} />
      ) : (
        <CustomInput {...props} marginBottom={".3rem"} />
      )}
      <MessageError>{props.err ? props.err : " "}</MessageError>
    </Box>
  );
};

const RegisterHomeAssistant = (props) => {
  const { width } = useWindowSize();

  const [payment, setPayment] = useState("1");

  const updateProfile = useActions((action) => action.user.updateProfile);
  const signup = useActions((action) => action.auth.createUser);
  const authError = useStore((state) => state.auth.authError);
  const updateError = useActions((state) => state.auth.updateAuthError);
  const getMe = useActions((action) => action.user.getMe);
  const getProfile = useActions((action) => action.user.getProfile);
  const user = useStore((state) => state.user.profile);
  const [loadingImage, setLoadingImage] = useState(false);
  const [loadingImageDocument, setLoadingImageDocument] = useState(false);
  const [loadingImageDocument2, setLoadingImageDocument2] = useState(false);

  useEffect(() => {
    if (!user?.id) {
      getProfile();
    }
  }, []);

  useEffect(() => {
    if (props.data) {
      const daysWork = Object.keys(
        formik.values.user_available_times
      )?.filter((item) => item?.includes("work"));

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

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        updateError("");
      }, 6000);
    }
  }, [authError]);

  const doUpload = async (e) => {
    e.preventDefault();
    setLoadingImageDocument(true);
    const fileName = await Upload("users/document", e.target.files[0]);
    formik.setFieldValue("document_image", fileName);

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

    setTimeout(() => {
      setLoadingImage(false);
      getMe();
    }, 2000);
  };

  const validate = (values) => {
    const err = {};
    const message = "Campo obrigatório";

    if (!values.name) err.name = message;
    if (!props.data?.id && !PasswordTest(values.password))
      err.password =
        "Senha deve conter letras maiúsculas e minúsculas, números e caracteres especiais (@$!%*?&#)";
    if (!values.email) err.email = message;
    if (!values.phone1) err.phone1 = message;
    if (!values.cpf) err.cpf = message;
    if (values.cpf && values.cpf.length > 0) {
      if (parseInt(values.cpf[0]) > 4 || parseInt(values.cpf[0]) === 0)
        err.cpf = "NIF inválido";
    }
    if (!values.rg) err.rg = message;
    if (!values.uf) err.uf = message;
    if (!values.payment) err.payment = message;
    if (!values.street) err.street = message;
    if (!values.number) err.number = message;
    if (!values.district) err.district = message;
    if (!values.state) err.state = message;
    if (!values.city) err.city = message;
    if (!values.country) err.country = message;
    if (!values.zipcode) err.zipcode = message;
    if (!values.country_born) err.country_born = message;
    if (!values.city_born) err.city_born = message;
    if (!values.date_born) err.date_born = message;
    if (!values.region_serve_customers) err.region_serve_customers = message;
    if (!values.region_serve_customers) err.region_serve_customers = message;
    if (values.arr_available_times?.length === 0)
      err.arr_available_times = message;

    if (values.arr_available_times?.length > 0) {
      for (let i = 0; i < values.arr_available_times.length; i++) {
        const item = values.arr_available_times[i];
        if (!item.time_in || !item.time_until) {
          err.arr_available_times = message;
        }
      }
    }
    if (!values.why_home_assistent) err.why_home_assistent = message;
    if (!values.lang) err.lang = message;
    if (!props.data?.user_info?.indication_accepted && !values.indication_code)
      err.indication_code = message;

    if (!values.document_image) err.document_image = message;
    if (!values.photo) err.photo = message;

    return err;
  };

  const formik = useFormik({
    initialValues: {
      type: 3,
      name: props.data?.name || "",
      gender: props.data?.gender || "1",
      country_born: props.data?.user_info?.country_born || "",
      city_born: props.data?.user_info?.city_born || "",
      rg: props.data?.user_info?.rg || "",
      uf: props.data?.user_info?.rg_emissor || "",
      document_image: props.data?.user_info?.document_image || null,
      document_image2: props.data?.user_info?.document_image2 || null,
      zipcode: props.data?.address?.zipcode || "",
      street: props.data?.address?.street || "",
      number: props.data?.address?.number || "",
      complement: props.data?.address?.complement || "",
      district: props.data?.address?.district || "",
      city: props.data?.address?.city || "",
      state: props.data?.address?.state || "",
      country: props.data?.address?.country || "",
      date_born:
        (props.data?.birthday?.length > 0 &&
          formatToDate(new Date(props.data?.birthday))) ||
        "",
      cpf: props.data?.user_info?.cpf || "",
      region_serve_customers: props.data?.user_info?.region_work || "",
      user_available_times: props.data?.user_available_times || {},
      why_home_assistent: props.data?.user_info?.why_home_assistent || "",
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
      note: props.data?.user_info?.note || "",
      lang: props.data?.user_language[0]?.language || "",
      arr_available_times: [],
      time_available: "",
      time_in: "",
      time_until: "",
      indication_code: props.data?.indication_code || "",
      phone1: props.data?.user_info?.phone1 || "",
      email: props.data?.email || "",
      password: "",
      type_work: props.data?.user_info?.type_work,
      type_user: props.data?.user_info?.type_user,
    },
    onSubmit: async (values, { setSubmitting }) => {
      const newAvailableTimes = values.arr_available_times.map((item, idx) => {
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

      let payload = {
        name: values.name,
        email: values.email,
        password: values.password,
        gender: values.gender,
        image: values.photo,
        birthday: parseToDate(values.date_born),
        indication_code: values.indication_code,
        user_info: {
          category_ids: null,
          phone1: values.phone1,
          cpf: values.cpf.replace(".", "").replace("-", ""),
          rg: values.rg,
          rg_emissor: values.uf,
          country_born: values.country_born,
          city_born: values.city_born,
          region_work: values.region_serve_customers,
          why_home_assistent: values.why_home_assistent,
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
          note: values.note,
          type: 3,
          type_home_assistent: true,
          type_user: values.type_user,
          type_work: values.type_work,
          payment: parseInt(payment),
          document_image: values.document_image,
          document_image2: values.document_image2,
        },
        user_available_times: objAvailableTimes,
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
      };

      if (values.has_social_link?.includes("false")) {
        delete payload.user_info.facebook_link;
        delete payload.user_info.instagram_link;
        delete payload.user_info.linkedin_link;
        delete payload.user_info.twitter_link;
      } else {
        values.facebook_link?.length === 0 &&
          delete payload.user_info.facebook_link;
        values.instagram_link?.length === 0 &&
          delete payload.user_info.instagram_link;
        values.linkedin_link?.length === 0 &&
          delete payload.user_info.linkedin_link;
        values.twitter_link?.length === 0 &&
          delete payload.user_info.twitter_link;
      }

      if (window.location.pathname?.includes("conta")) {
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
            // cpf: values.cpf.replace(".", "").replace("-", ""),
            // rg: values.rg,
            // rg_emissor: values.uf,
            // rg_emissor_date: parseToDate(values.date_issue),
            country_born: values.country_born,
            city_born: values.city_born,
            region_work: values.region_serve_customers,
            why_home_assistent: values.why_home_assistent,
            has_social_link: values.has_social_link?.includes("true")
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
            note: values.note,
            type: 3,
            type_home_assistent: true,
            payment: parseInt(payment),
            document_image: values.document_image,
            document_image2: values.document_image2,
          },
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
          available: objAvailableTimes,
          user_language: values.user_language,
        });
      } else {
        signup(payload);
      }

      setSubmitting(false);
      // formik.resetForm();
    },
    validate,
  });

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
    <Container>
      <span
        style={{ cursor: "pointer" }}
        onClick={() => {
          window.scrollTo(0, 0);
          window.open(HelpPdf, "_blank");
        }}
      >
        <LabelLink>Dúvidas? clique aqui</LabelLink>
      </span>
      <MyForm onSubmit={formik.handleSubmit}>
        {authError && (
          <Alert status="error">
            <AlertIcon />
            {authError}
          </Alert>
        )}
        <Grid>
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
            placeholder="Nome Completo"
            name="name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          <Col>
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
          </Col>
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
              !!formik.errors.phone1 &&
              formik.touched.phone1 &&
              !!formik.errors.phone1
            }
            err={formik.touched?.phone1 && formik.errors.phone1}
            label="Telefone"
            placeholder="111 111 111"
            name="phone1"
            value={formik.values.phone1}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* <Rifm
            accept={/\d+/g}
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
                label="Telefone"
                name="phone1"
                value={value}
                onChange={onChange}
                onBlur={formik.handleBlur}
              />
            )}
          </Rifm> */}
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
            disabled={props.data?.id > 0 ? true : false}
            isInvalid={
              !!formik.errors.rg && formik.touched.rg && !!formik.errors.rg
            }
            err={formik.errors.rg && formik.touched.rg && formik.errors.rg}
            label="Número do documento de identificação"
            name="rg"
            placeholder="CC, AR ou Passaporte"
            value={formik.values.rg}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Row height="auto" justifyContent="space-between">
            <MyInput
              disabled={props.data?.id > 0 ? true : false}
              isInvalid={
                !!formik.errors.uf && formik.touched.uf && !!formik.errors.uf
              }
              err={formik.errors.uf && formik.touched.uf && formik.errors.uf}
              width={width >= 1024 && "84% !important"}
              label="Emitido por"
              // marginBottom={width <= 1024 && "2rem"}
              name="uf"
              value={formik.values.uf}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Row>
          <Box display="flex" alignItems="flex-end">
            {formik.values.document_image?.length > 0 ? (
              <Col>
                <Label>Cópia do documento</Label>
                <BoxAvatar>
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
                </BoxAvatar>
              </Col>
            ) : (
              <Col>
                <Label>Cópia do documento</Label>
                <BoxAvatar style={{ backgroundColor: "#fff" }}>
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
                </BoxAvatar>
                <MessageError>{formik.errors.document_image}</MessageError>
              </Col>
            )}

            {formik.values.document_image2?.length > 0 ? (
              <Col>
                <BoxAvatar>
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
                </BoxAvatar>
              </Col>
            ) : (
              <Col>
                <BoxAvatar style={{ backgroundColor: "#fff" }}>
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
                </BoxAvatar>
                <MessageError>{formik.errors.document_image2}</MessageError>
              </Col>
            )}
          </Box>
        </Grid>
        <Grid marginTop="2.5rem">
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
          />
          <Row height="auto" justifyContent="space-between">
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
              // marginBottom={width <= 1024 && "2rem"}
              width={width >= 1024 && "84% !important"}
              label="Nº"
              placeholder="ex: 600"
              name="number"
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
              width={width >= 1024 && "88% !important"}
              label="Complemento"
              placeholder="ex: ap 100"
              name="complement"
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
            label="Freguesia"
            placeholder="ex: jd. america"
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
                defaultValue={{
                  label: formik.values.state,
                  value: formik.values.state,
                }}
                options={districtJson}
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
            label="País"
            name="country"
            value={formik.values.country}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
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
                isInvalid={
                  !!formik.errors.date_born &&
                  formik.touched.date_born &&
                  !!formik.errors.date_born
                }
                err={
                  formik.errors.date_born &&
                  formik.touched.date_born &&
                  formik.errors.date_born
                }
                label="Data de nascimento"
                placeholder="ex: 20/01/2000"
                name="date_born"
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
            placeholder=""
            name="region_serve_customers"
            value={formik.values.region_serve_customers}
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
                    formik.touched.arr_available_times &&
                    formik.errors.arr_available_times}
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
          <MyInput
            isInvalid={
              !!formik.errors.why_home_assistent &&
              formik.touched.why_home_assistent &&
              !!formik.errors.why_home_assistent
            }
            err={
              formik.errors.why_home_assistent &&
              formik.touched.why_home_assistent &&
              formik.errors.why_home_assistent
            }
            label="Razões pelas quais gostaria de ser um Home Assistant?"
            name="why_home_assistent"
            value={formik.values.why_home_assistent}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.values.photo?.length > 0 ? (
            <Col>
              <Label>Foto de Perfil</Label>
              <BoxAvatar>
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
              </BoxAvatar>
            </Col>
          ) : (
            <Col>
              <Label>Foto de Perfil</Label>
              <BoxAvatar style={{ backgroundColor: "#fff" }}>
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
              </BoxAvatar>
              <MessageError>{formik.errors.photo}</MessageError>
            </Col>
          )}
        </Grid>
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
                <Grid>
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
                </Grid>
              </Box>
            )}
        </Col>
        <Grid marginTop="2rem">
          <Box>
            <Label>Carta Condução</Label>
            <CustomRadio
              value={formik.values.drivers_license}
              options={[
                { label: "Sim", value: "true" },
                { label: "Não", value: "false" },
              ]}
              name="drivers_license"
              onChange={(value) =>
                formik.setFieldValue("drivers_license", value)
              }
            />
          </Box>
          <Row>
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
                onChange={(value) =>
                  formik.setFieldValue("remuneration_type", value)
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
              marginLeft={width >= 1024 ? "1rem" : width < 1024 && "0"}
              placeholder={"Valor"}
              name="remuneration_price"
              value={formik.values.remuneration_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
          </Row>
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
        </Grid>
        <Col marginTop={"1rem"}>
          <Grid>
            <Box marginBottom={"1rem"}>
              <Box>
                <Box display="flex" alignItems="flex-end">
                  <Box>
                    <Label>Idiomas</Label>
                    <CustomSelect
                      width="95%"
                      placeholder="Selecione um idioma"
                      onChange={(e) =>
                        formik.setFieldValue("lang", e.target.value)
                      }
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
                  {formik.errors.lang &&
                    formik.touched.lang &&
                    formik.errors.lang}
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
          </Grid>
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
          <Grid marginTop={width <= 440 ? "1rem" : "2rem"}>
            <MyInput
              isInvalid={
                !!formik.errors.email &&
                formik.touched.email &&
                !!formik.errors.email
              }
              err={
                formik.errors.email &&
                formik.touched.email &&
                formik.errors.email
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
              />
            )}
          </Grid>
        </Col>
        <Box width={width <= 440 ? "100%" : "50%"} margin="0 auto">
          <Button
            disabled={formik.isSubmitting}
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
          >
            {window.location.pathname?.includes("conta")
              ? "atualizar"
              : "cadastrar"}
          </Button>
        </Box>
      </MyForm>
    </Container>
  );
};

export default RegisterHomeAssistant;

const Container = styled(Box)`
  padding: 3rem 0;
  min-height: 500px;
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 3rem 1rem;
  }
`;

const SelectRegisterType = styled.h1`
  padding: 0;
  margin: 0 0 1rem 0;
  color: ${(props) => props.theme.color.green};
`;

const Title = styled.h2`
  padding: 0;
  margin: 0;
  color: ${(props) => props.theme.color.green};
  font-size: 1.5rem;
`;

const ContainerSelect = styled(Box)`
  display: flex;
  margin-bottom: 2rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    flex-direction: column;
  }
`;

const MyForm = styled.form`
  padding: 2rem 0;
`;

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 20px 40px;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
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

const CustomCheckbox = styled(Checkbox)`
  margin-left: 1rem;
  .css-nlndso {
    color: #eee;
  }
  border-color: lightgray;
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

//updload avatar

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
  width: 120px;
  height: 120px;
  cursor: pointer;
  z-index: 1;
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
  width: 120px;
  height: 120px;
  object-fit: cover;
  position: absolute;
`;

const CustomSelect = styled(Select)`
  height: 50px !important;
  border: 2px solid #eee !important;
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

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

//my input component
const Label = styled.label`
  margin-right: 5px;
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

const MySelect = styled(ReactSelect)`
  margin-bottom: 2rem;
`;

const LabelLink = styled(Label)`
  &:hover {
    cursor: pointer;
    text-decoration: underline;
  }
`;
