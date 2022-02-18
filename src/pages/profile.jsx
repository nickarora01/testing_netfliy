import React from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import { withRouter } from "react-router-dom";
import { useStore, useActions } from "../configureStore";
import _ from "lodash";

import RegisterWorker from "./registerWorker";
import RegisterHomeAssistant from "./registerHomeAssistant";
import Register from "./register";
import PessonalIdentification from "../components/RegisterWizard/PessonalIdentification";
import ProfessionalsInformation from "../components/RegisterWizard/ProfessionalsInformation";
import Documents from "../components/RegisterWizard/Documents";
import ProfessionalExperience from "../components/RegisterWizard/ProfessionalExperience";
import AdditionalInformations from "../components/RegisterWizard/AdditionalInformations";
import { useFormik } from "formik";
import { formatToDate, parseToDate, isDate } from "brazilian-values";
import { PasswordTest } from "../utils/helper";

const Step = (props) => {
  const { title, typeRegister } = props;
  return (
    <GridStep>
      <Title>{title}</Title>
      <div>
        {React.cloneElement(props.children, { typeRegister, ...props })}
      </div>
    </GridStep>
  );
};

const Profile = (props) => {
  const saveUser = useActions((action) => action.auth.saveUser);
  const profile = useStore((state) => state.user.profile);
  const getProfile = useActions((action) => action.user.getProfile);

  const _type = profile?.user_info?.type || 1;

  const formik = useFormik({
    initialValues: {
      not_become: true,
      type: _type,
      type_work: profile?.user_info?.type_work || _type === 2,
      type_user: profile?.user_info?.type_user || _type === 1,
      type_home_assistent:
        profile?.user_info?.type_home_assistent || _type === 3,
      id: profile?.id || 0,
      name: profile?.name || "",
      date_born:
        profile?.birthday?.length > 0
          ? formatToDate(new Date(profile?.birthday))
          : "",
      gender: profile?.gender || "1",
      cpf: profile?.user_info?.cpf || "",
      rg: profile?.user_info?.rg || "",
      uf: profile?.user_info?.rg_emissor || "",
      zipcode: profile?.address?.zipcode || "",
      street: profile?.address?.street || "",
      number: profile?.address?.number || "",
      complement: profile?.address?.complement || "",
      district: profile?.address?.district || "",
      city: profile?.address?.city || "",
      state: profile?.address?.state || "",
      country: profile?.address?.country || "",
      phone1: profile?.user_info?.phone1 || "",
      email: profile?.email || "",
      password: "",

      categories: profile?.user_info?.category_ids || [],
      where_you_work: profile?.user_info?.region_work || "",
      indication_code: profile?.indication_code || "",
      region_serve_customers: profile?.user_info?.region_work || "",

      document_image: profile?.user_info?.document_image || null,
      document_image2: profile?.user_info?.document_image2 || null,
      photo: profile?.image || null,
      father_name: profile?.user_info?.father_name || "",
      mother_name: profile?.user_info?.mother_name || "",
      city_born: profile?.user_info?.city_born || "",
      country_born: profile?.user_info?.country_born || "",

      experience_description: profile?.user_info?.experience || "",
      experience_time: profile?.user_info?.time_experience || "",
      completed_courses: profile?.user_info?.courses || "",
      schooling: profile?.user_info?.schooling || "",
      cv_link: profile?.user_info?.cv_link || "",
      remuneration_price:
        parseFloat(profile?.user_info?.remuneration_price) || "",
      remuneration_type:
        profile?.user_info?.remuneration_type?.toString() || "1",
      arr_available_times: [],
      user_available_times: profile?.user_available_times || {},
      why_home_assistent: profile?.user_info?.why_home_assistent || "",

      has_social_link:
        profile?.user_info?.has_social_link?.toString() || "false",
      can_share_social_link:
        profile?.user_info?.can_share_social_link?.toString() || "false",
      facebook_link: profile?.user_info?.facebook_link || "",
      instagram_link: profile?.user_info?.instagram_link || "",
      linkedin_link: profile?.user_info?.linkedin_link || "",
      twitter_link: profile?.user_info?.twitter_link || "",

      drivers_license:
        profile?.user_info?.car_permission?.toString() || "false",
      living_with_pets:
        profile?.user_info?.animal_coexistence?.toString() || "true",
      smoker: profile?.user_info?.smoking?.toString() || "false",
      user_language: profile?.user_language || [],
      lang:
        profile?.user_language?.length > 0
          ? profile?.user_language[0]?.language || ""
          : "",
      note: profile?.user_info?.note || "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const auth = JSON.parse(localStorage.getItem("4you_auth"));
      const payload = payloader(values);
      await saveUser({
        payload,
        id: auth?.user?.id || 0,
        step:
          profile?.user_info?.type_user &&
          !profile?.user_info?.type_work &&
          !profile?.user_info?.type_home_assistent
            ? 1
            : 5,
        edit: true,
      });
      setSubmitting(false);
      getProfile();
    },
    validate: (values) => {
      const err = {};
      const message = "Campo obrigatório";
      const message_invalid = "Valor inválido";

      if (!values.name) err.name = message;
      if (!values.date_born) err.date_born = message;
      if (!isDate(values.date_born))
        err.date_born = "Data de nascimento inválida";
      if (values.date_born) {
        const breakdate = values.date_born.split("/");
        if (breakdate && breakdate.length === 3) {
          const dt = new Date(
            `${breakdate[2]}-${breakdate[1]}-${breakdate[0]}`
          );
          if (
            isNaN(dt) ||
            dt >
              new Date(
                new Date().getFullYear(),
                new Date().getMonth(),
                new Date().getDate()
              )
          ) {
            err.date_born = "Data de Nascimento Inválida";
          }
        } else if (breakdate && breakdate.length > 0) {
          for (let item of breakdate) {
            if (parseInt(item) === 0)
              err.date_born = "Data de Nascimento Inválida";
          }
        } else err.date_born = "Data de Nascimento Inválida";
      }
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

      if (values.type_work) {
        if (values.categories?.length === 0) err.categories = message;
        if (!values.where_you_work) err.where_you_work = message;
      }

      if (values.type_home_assistent) {
        if (!values.region_serve_customers)
          err.region_serve_customers = message;
      }

      if (values.type_work || values.type_home_assistent) {
        if (!values.indication_code) err.indication_code = message;

        if (!values.father_name) err.father_name = message;
        if (!values.mother_name) err.mother_name = message;
        if (!values.city_born) err.city_born = message;
        if (!values.country_born) err.country_born = message;

        if (!values.photo) err.photo = message;
        if (!values.document_image) err.document_image = message;
        if (!values.document_image2) err.document_image2 = message;
      }

      if (values.type_work) {
        if (!values.experience_description)
          err.experience_description = message;
        if (!values.experience_time) err.experience_time = message;
        if (!values.schooling) err.schooling = message;
      }

      if (values.type_home_assistent) {
        if (!values.why_home_assistent) err.why_home_assistent = message;
      }

      if (values.type_work || values.type_home_assistent) {
        if (values.arr_available_times?.length === 0)
          err.arr_available_times = message;

        if (values.arr_available_times?.length > 0) {
          for (let i = 0; i < values.arr_available_times.length; i++) {
            const item = values.arr_available_times[i];
            if (!item.time_in || !item.time_until) {
              err.arr_available_times =
                "Selecione um horário para cada um dos campos";
            }
          }
        }
      }

      return err;
    },
  });

  const payloader = (values) => {
    const newAvailableTimes = values.arr_available_times?.map((item, idx) => {
      const work = item.day;
      const time = `${item.time_in} às ${item.time_until}`;
      const label = item.day.replace("work", "time");
      return {
        [work]: true,
        [label]: time,
      };
    });

    const objAvailableTimes = {};

    const mapAvailableTimes = newAvailableTimes?.map((item) => {
      Object.assign(objAvailableTimes, item);

      return objAvailableTimes;
    });

    const arrCategoriesIds = [];

    const mapCategories = values.categories?.map((item) => {
      if (isNaN(item)) {
        arrCategoriesIds.push(item.value);
      } else {
        arrCategoriesIds.push(item);
      }
      return arrCategoriesIds;
    });

    return {
      name: values.name || profile?.name,
      email: values.email || profile?.email,
      password: values.password,
      gender: values.gender || profile?.gender,
      image: values.photo,
      birthday: values.date_born
        ? parseToDate(values.date_born)
        : (profile?.birthday?.length > 0 && new Date(profile?.birthday)) || "",
      indication_code: values.indication_code || profile?.indication_code,
      user_info: {
        phone1: values.phone1 || profile?.user_info?.phone1,
        cpf:
          (values.cpf && values.cpf.replace(".", "").replace("-", "")) ||
          profile?.user_info?.cpf,
        rg: values.rg || profile?.user_info?.rg,
        rg_emissor: values.uf || profile?.user_info?.rg_emissor,
        country_born: values.country_born || profile?.user_info?.country_born,
        city_born: values.city_born || profile?.user_info?.city_born,
        has_social_link: values.has_social_link?.includes("true")
          ? true
          : false,
        can_share_social_link: values.can_share_social_link?.includes("true")
          ? true
          : false,
        facebook_link:
          values.facebook_link || profile?.user_info?.facebook_link,
        instagram_link:
          values.instagram_link || profile?.user_info?.instagram_link,
        linkedin_link:
          values.linkedin_link || profile?.user_info?.linkedin_link,
        twitter_link: values.twitter_link || profile?.user_info?.twitter_link,
        car_permission: values.drivers_license?.includes("true") ? true : false,
        remuneration_type:
          parseInt(values.remuneration_type) ||
          profile?.user_info?.remuneration_type,
        remuneration_price:
          parseFloat(values.remuneration_price) ||
          profile?.user_info?.remuneration_price,
        animal_coexistence: values.living_with_pets?.includes("true")
          ? true
          : false,
        smoking: values.smoker?.includes("true") ? true : false,
        experience:
          values.experience_description || profile?.user_info?.experience,
        time_experience:
          values.experience_time || profile?.user_info?.time_experience,
        courses: values.completed_courses || profile?.user_info?.courses,
        schooling: values.schooling || profile?.user_info?.schooling,
        cv_link: values.cv_link,
        note: values.note || profile?.user_info?.note,
        type: values.type || profile?.user_info?.type,
        type_work: values.type_work || profile?.user_info?.type_work,
        type_user: values.type_user || profile?.user_info?.type_user,
        type_home_assistent:
          values.type_home_assistent || profile?.user_info?.type_home_assistent,
        payment: parseInt(values.payment) || profile?.user_info?.payment,
        category_ids:
          arrCategoriesIds?.length > 0
            ? arrCategoriesIds
            : profile?.user_info?.category_ids,
        document_image: values.document_image,
        document_image2: values.document_image2,
        mother_name: values.mother_name || profile?.user_info?.mother_name,
        father_name: values.father_name || profile?.user_info?.father_name,
        region_work:
          values.where_you_work ||
          values.region_serve_customers ||
          profile?.user_info?.region_work,
        why_home_assistent:
          values.why_home_assistent || profile?.user_info?.why_home_assistent,
      },
      user_available_times: objAvailableTimes || profile?.user_available_times,
      address: {
        street: values.street || profile?.address?.street,
        number: parseInt(values.number) || profile?.address?.number,
        district: values.district || profile?.address?.district,
        state: values.state || profile?.address?.state,
        city: values.city || profile?.address?.city,
        country: values.country || profile?.address?.country,
        zipcode: values.zipcode?.toString() || profile?.address?.zipcode,
        complement: values.complement || profile?.address?.complement,
      },
      user_language: values.user_language || profile?.user_language,
    };
  };

  const steps_work_home = [
    { title: "Identificação Pessoal", children: <PessonalIdentification /> },
    {
      title: "Informações Profissionais",
      children: <ProfessionalsInformation />,
    },
    { title: "Documentos", children: <Documents /> },
    { title: "Experiência Profissional", children: <ProfessionalExperience /> },
    {
      title: "Informações Adicionais",
      children: <AdditionalInformations />,
    },
  ];
  const steps_user = [
    { title: "Identificação Pessoal", children: <PessonalIdentification /> },
  ];

  return (
    <Container>
      {profile?.user_info?.type_user &&
      !profile?.user_info?.type_work &&
      !profile?.user_info?.type_home_assistent
        ? steps_user.map((step, idx) => (
            <Step
              key={idx}
              title={step.title}
              save={saveUser}
              values={profile}
              edit={true}
              _formik={formik}
            >
              {step.children}
            </Step>
          ))
        : steps_work_home.map((step, idx) => (
            <Step
              key={idx}
              title={step.title}
              save={saveUser}
              values={profile}
              edit={true}
              _formik={formik}
            >
              {step.children}
            </Step>
          ))}
    </Container>
  );
};

export default withRouter(Profile);

const Container = styled(Box)`
  padding-bottom: 3rem;
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
`;

const Title = styled(Box)`
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
  font-size: 24px;
`;

const GridStep = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: auto 1fr;
  button.next {
    margin-left: auto;
  }
  button.previous {
    margin-right: auto;
  }
`;
