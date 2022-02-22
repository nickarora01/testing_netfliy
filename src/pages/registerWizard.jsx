import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import StepWizard from "react-step-wizard";
import { Alert, AlertIcon, Box, Button } from "@chakra-ui/react";
import { theme } from "../theme";
import useWindowSize from "../hooks/useWIndowSize";
import { Icon } from "evergreen-ui";
import PessonalIdentification from "../components/RegisterWizard/PessonalIdentification";
import ProfessionalsInformation from "../components/RegisterWizard/ProfessionalsInformation";
import Documents from "../components/RegisterWizard/Documents";
import ProfessionalExperience from "../components/RegisterWizard/ProfessionalExperience";
import AdditionalInformations from "../components/RegisterWizard/AdditionalInformations";
import { useActions, useStore } from "../configureStore";
import { formatToDate, parseToDate } from "brazilian-values";
import _ from "lodash";
import queryString from "query-string";
import { useParams } from "react-router-dom";

const Step = (props) => {
  const { title, typeRegister } = props;
  return (
    <GridStep>
      <Title2>{title}</Title2>
      <StepContent>
        {React.cloneElement(props.children, { typeRegister, ...props })}
      </StepContent>
    </GridStep>
  );
};

const Nav = (props) => {
  const dots = [];
  for (let i = 1; i <= props.totalSteps; i += 1) {
    const isActive = props.currentStep === i;
    dots.push(
      <span
        key={`step-${i}`}
        className={isActive ? "active" : ""}
        // onClick={() => props.goToStep(i)}
      >
        &bull;
      </span>
    );
  }

  return <GridStepNav>{props.totalSteps > 1 && dots}</GridStepNav>;
};

const RegisterWizard = (props) => {
  const { width } = useWindowSize();
  const query = queryString.parse(props.location.search);
  const queryStep = parseInt(query.s) || 1;
  const { type } = useParams();

  const [stepCurrent, setStepCurrent] = useState(queryStep);
  const [typeRegister, setTypeRegister] = useState(
    type === "profissional" ? 2 : type === "home-assistant" ? 3 : 1
  );

  const setIsSuccess = useActions((action) => action.auth.setIsSuccess);
  const isSuccess = useStore((state) => state.auth.isSuccess);

  const authError = useStore((state) => state.auth.authError);
  const isAuth = useStore((state) => state.auth.isAuthenticated);

  const getProfile = useActions((action) => action.user.getProfile);
  const profile = useStore((state) => state.user.profile);

  const saveUser = useActions((action) => action.auth.saveUser);

  const [wizard, setWizard] = useState({
    form: {},
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
      image: values.photo || profile?.image,
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
        has_social_link:
          (values.has_social_link?.includes("true") ? true : false) ||
          profile?.user_info?.has_social_link,
        can_share_social_link:
          (values.can_share_social_link?.includes("true") ? true : false) ||
          profile?.user_info?.can_share_social_link,
        facebook_link:
          values.facebook_link || profile?.user_info?.facebook_link,
        instagram_link:
          values.instagram_link || profile?.user_info?.instagram_link,
        linkedin_link:
          values.linkedin_link || profile?.user_info?.linkedin_link,
        twitter_link: values.twitter_link || profile?.user_info?.twitter_link,
        car_permission:
          (values.drivers_license?.includes("true") ? true : false) ||
          profile?.user_info?.car_permission,
        remuneration_type:
          parseInt(values.remuneration_type) ||
          profile?.user_info?.remuneration_type,
        remuneration_price:
          parseFloat(values.remuneration_price) ||
          profile?.user_info?.remuneration_price,
        animal_coexistence:
          (values.living_with_pets?.includes("true") ? true : false) ||
          profile?.user_info?.animal_coexistence,
        smoking:
          (values.smoker?.includes("true") ? true : false) ||
          profile?.user_info?.smoking,
        experience:
          values.experience_description || profile?.user_info?.experience,
        time_experience:
          values.experience_time || profile?.user_info?.time_experience,
        courses: values.completed_courses || profile?.user_info?.courses,
        schooling: values.schooling || profile?.user_info?.schooling,
        cv_link: values.cv_link || profile?.user_info?.cv_link,
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
        document_image:
          values.document_image || profile?.user_info?.document_image,
        document_image2:
          values.document_image2 || profile?.user_info?.document_image2,
        mother_name: values.mother_name || profile?.user_info?.mother_name,
        father_name: values.father_name || profile?.user_info?.father_name,
        region_work:
          values.where_you_work ||
          values.region_serve_customers ||
          profile?.user_info?.region_work,
        why_home_assistent:
          values.why_home_assistent || profile?.user_info?.why_home_assistent,
      },
      user_available_times: !_.isEmpty(objAvailableTimes)
        ? objAvailableTimes
        : profile?.user_available_times,
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

  useEffect(() => {
    if (isSuccess && wizard?.SW?.nextStep) {
      setIsSuccess(false);
      wizard.SW.nextStep();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isAuth) {
      getProfile();
    }
  }, [isAuth, stepCurrent]);

  useEffect(() => {
    if (profile && !_.isEmpty(profile)) {
      const path =
        profile?.user_info?.type === 2
          ? "profissional"
          : profile?.user_info?.type === 3
          ? "home-assistant"
          : "";
      setTypeRegister(profile?.user_info?.type || 1);
      props.history.replace({
        pathname: `/cadastro/wizard/${path}`,
        search: `?s=${stepCurrent}`,
        state: { some: "state" },
      });
    }
  }, [profile, stepCurrent]);

  const setInstance = (SW) => {
    setWizard({
      ...wizard,
      SW,
    });
  };

  const onStepChange = (stats) => {
    setStepCurrent(stats.activeStep);
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
    <Content {...props}>
      {authError && (
        <Alert status="error">
          <AlertIcon />
          {authError}
        </Alert>
      )}
      <Title>
        {`Inscrição de ${
          typeRegister === 1
            ? "Usuário"
            : typeRegister === 2
            ? "Profissional"
            : "Home Assistant"
        }`}
      </Title>
      <ContainerVideo>
        <MyIframe
          src="https://www.youtube.com/embed/8S6EGmq0Ck0"
          title="YouTube video player"
          frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen
        ></MyIframe>
      </ContainerVideo>
      <StepWizard
        onStepChange={onStepChange}
        nav={<Nav />}
        instance={setInstance}
        initialStep={stepCurrent}
      >
        {typeRegister === 1 &&
          steps_user.map((step) => (
            <Step
              title={step.title}
              typeRegister={typeRegister}
              save={saveUser}
              payloader={payloader}
              values={profile}
              stepCurrent={stepCurrent}
            >
              {step.children}
            </Step>
          ))}
        {typeRegister !== 1 &&
          steps_work_home.map((step) => (
            <Step
              title={step.title}
              typeRegister={typeRegister}
              save={saveUser}
              payloader={payloader}
              values={profile}
              stepCurrent={stepCurrent}
            >
              {step.children}
            </Step>
          ))}
      </StepWizard>
    </Content>
  );
};

export default RegisterWizard;

const Content = styled(Box)`
  padding: 3rem 0;
  min-height: 500px;
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  overflow: hidden;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 3rem 1rem;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 2rem 0.5rem;
  }
`;

const Title = styled.h1`
  font-size: 1.75em;
  padding: 0 0.1em;
  margin: 0 0 1em 0;
  color: ${(props) => props.theme.color.green};
`;
const Title2 = styled.h2`
  font-size: 1.5em;
  padding: 0 0.1em;
  margin: 0 0 1em 0;
  color: ${(props) => props.theme.color.green};
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
const GridStepNav = styled.div`
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  width: 100%;
  max-width: 280px;
  text-align: center;
  align-items: center;

  span {
    cursor: pointer;
    font-size: 36px;
    line-height: 1;
    margin: 0 15px;
    opacity: 0.4;
    text-shadow: none;
    transition: opacity 1s ease;
    &.active {
      color: ${(props) => props.theme.color.green};
      opacity: 1;
      text-shadow: 0 0px 16px;
      font-size: 48px;
    }
  }
`;
const StepContent = styled.div`
  /* min-height: 450px; */
`;
const CustomIcon = styled(Icon)`
  cursor: pointer;
  :hover,
  :focus {
    opacity: 0.8;
  }
`;

const ContainerVideo = styled.div`
  text-align: center;
`;

const MyIframe = styled.iframe`
  width: 550px;
  height: 350px;

  @media (max-width: 768px) {
    width: 650px;
  }

  @media (max-width: 425px) {
    width: 400px;
    height: 300px;
  }

  @media (max-width: 375px) {
    width: 350px;
    height: 300px;
  }
`;
