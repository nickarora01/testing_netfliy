import {
  Box,
  Button,
  Input,
  Select,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { Rifm } from "rifm";
import styled from "styled-components";
import useWindowSize from "../../hooks/useWIndowSize";
import {
  changeNameDays,
  downloadFile,
  formatDate,
  formatFile,
  formatNIF,
  formatZip,
} from "../../utils/helper";
import MyInput from "./MyInput";
import MyRadio from "./MyRadio";
import districtJson from "../../json/portugal_district.json";
import MySelect from "./MySelect";
import { Checkbox as EverCheckbox, Icon } from "evergreen-ui";
import { useStore } from "easy-peasy";
import MyButton from "./MyButton";
import { Upload } from "../../utils/upload";
import { useActions } from "../../configureStore";
import CvIcon from "../../assets/icons/file.svg";
import { theme } from "../../theme";
import { remove } from "lodash";
import { CloseIcon } from "@chakra-ui/icons";
import LabelWithTooltip from "../LabelWithTooltip";

const ProfessionalExperience = (props) => {
  const getMe = useActions((action) => action.user.getMe);
  const user = useStore((state) => state.user.user);
  const [loadingCv, setLoadingCv] = useState(false);

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

  const { width } = useWindowSize();
  const {
    values,
    nextStep,
    previousStep,
    save,
    payloader,
    stepCurrent,
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
      experience_description: values?.user_info?.experience || "",
      experience_time: values?.user_info?.time_experience || "",
      completed_courses: values?.user_info?.courses || "",
      schooling: values?.user_info?.schooling || "",
      cv_link: values?.user_info?.cv_link || "",
      remuneration_price:
        parseFloat(values?.user_info?.remuneration_price) || "",
      remuneration_type: parseInt(values?.user_info?.remuneration_type) || 1,
      arr_available_times: [],
      user_available_times: values?.user_available_times || {},
      why_home_assistent: values?.user_info?.why_home_assistent || "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const auth = JSON.parse(localStorage.getItem("4you_auth"));
      const payload = payloader(values);
      await save({ payload, id: auth?.user?.id || 0, step: 4, edit: false });
      setSubmitting(false);
    },
    validate: (values) => {
      const err = {};
      const message = "Campo obrigatório";

      if (_type === 2) {
        if (!values.experience_description)
          err.experience_description = message;
        if (!values.experience_time) err.experience_time = message;
        if (!values.schooling) err.schooling = message;
      }

      if (_type === 3) {
        if (!values.why_home_assistent) err.why_home_assistent = message;
      }

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

      return err;
    },
  });

  formik = edit ? _formik : formik;

  useEffect(() => {
    if (values) {
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
  }, [values]);

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
      {formik.values.type_work && (
        <Grid width={width}>
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
            label="Descrição Experiência"
            placeholderTemplate="Insira a"
            name="experience_description"
            value={formik.values.experience_description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            infoMessage="Descreva sua experiência profissional de forma detalhada. Lembre-se da importância dessa informação para avaliação dos contratantes"
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
            label="Tempo experiência"
            placeholderTemplate="Insira o"
            name="experience_time"
            value={formik.values.experience_time}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            infoMessage="Informe o número de anos trabalhado no serviço que você realiza há mais tempo"
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
            placeholderTemplate="Insira os"
            name="completed_courses"
            value={formik.values.completed_courses}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            infoMessage="Preencha com os cursos que te conferem maior credibilidade. Se o nome da instituição for relevante, vale a pena informar"
          />
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
            label="Nível Educacional"
            placeholderTemplate="Insira o"
            name="schooling"
            value={formik.values.schooling}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            infoMessage="Selecione entre as opções básico, médio, superior ou pós-graduação"
          />
          <Box>
            <LabelWithTooltip
              label="Anexar CV (Opcional)"
              infoMessage="Informações como contatos e número de documentos poderão ser vistas por quaisquer assinantes da plataforma. Aconselhamos não expor essas informações para que você decida quem pode conhecer seus dados"
            />
            <Box display="flex" alignItems="center">
              <BoxAvatar style={{ backgroundColor: "#fff" }}>
                <InputImage
                  type="file"
                  onChange={(e) => doUploadCv(e)}
                  accept="image/*, .pdf, .doc"
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
              </BoxAvatar>
              <DescriptionLink
                onClick={() => {
                  user?.user_premium &&
                    downloadFile(
                      `${process.env.REACT_APP_ASSETS_BUCKET}/cv/${formik.values.cv_link}`
                    );
                }}
              >
                {formatFile(formik.values.cv_link)}
              </DescriptionLink>
              {formik.values.cv_link && (
                <DeleteBtn
                  marginTop={width <= 440 ? "-1.1rem" : "0"}
                  paddingBottom=".5rem"
                  paddingLeft=".5rem"
                  aria-label="remove"
                  name="close"
                  onClick={() => {
                    formik.setFieldValue("cv_link", null);
                  }}
                />
              )}
            </Box>
          </Box>
        </Grid>
      )}
      {formik.values.type_home_assistent && (
        <Grid width={width}>
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
        </Grid>
      )}
      <Grid width={width}>
        <Box>
          <LabelWithTooltip
            label="Datas/horários disponíveis"
            infoMessage="Selecione uma opção de cada vez e depois os horários disponíveis a cada dia. Salve e continue selecionando os dias e horários em que costuma trabalhar. Informação importante para os contratantes"
          />
          <Grouping>
            <Box display="flex" flexDirection="column">
              <MyRadio
                myLabel=""
                name="remuneration_type"
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
            </Box>
            <MyInput
              type="number"
              placeholder={"Valor"}
              name="remuneration_price"
              value={formik.values.remuneration_price}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              width="125px !important"
            />
          </Grouping>
        </Box>
        <Box>
          <Box display="flex" alignItems="flex-end">
            <Box width="100%">
              <Label>Datas/horários disponíveis</Label>
              <CustomSelect
                isInvalid={
                  !!formik.errors.arr_unavailable_times &&
                  formik.touched.arr_unavailable_times &&
                  !!formik.errors.arr_unavailable_times
                }
                width="100%"
                placeholder="Selecione"
                onChange={(e) => {
                  if (e.target.value.length > 0) {
                    userAvailableTimes.push({
                      day: e.target.value,
                      show: true,
                      time_in: "",
                      time_until: "",
                    });
                    formik.setFieldValue(
                      "arr_available_times",
                      userAvailableTimes
                    );
                  }
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
              <Box fontSize=".9rem" marginRight="1rem" width={"100px"}>
                {changeNameDays(item?.day)}
              </Box>
              <Box display="flex" alignItems={"flex-end"}>
                <Box width="99%">
                  <Label>De</Label>
                  <CustomSelect
                    isInvalid={
                      !!formik.errors.arr_available_times &&
                      formik.touched.arr_available_times &&
                      !item.time_in
                    }
                    boxWidth={"30% !important"}
                    placeholder="Selecione"
                    value={item.time_in}
                    onChange={(e) => {
                      item.time_in = e.target.value;
                      item.show = true;

                      formik.setFieldValue(
                        "arr_available_times",
                        userAvailableTimes
                      );
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1)
                      .filter((o) => {
                        if (formik.values.time_until) {
                          return o < formik.values.time_until;
                        } else {
                          return true;
                        }
                      })
                      .map((item, idx) => (
                        <option value={item} key={idx}>
                          {`${item !== 24 ? item : 0}h`}
                        </option>
                      ))}
                  </CustomSelect>
                </Box>
                <Box width="99%">
                  <Label>Até</Label>
                  <CustomSelect
                    isInvalid={
                      !!formik.errors.arr_available_times &&
                      formik.touched.arr_available_times &&
                      !item.time_until
                    }
                    boxWidth={"30% !important"}
                    placeholder="Selecione"
                    value={item.time_until}
                    onChange={(e) => {
                      item.time_until = e.target.value;
                      item.show = true;

                      formik.setFieldValue(
                        "arr_available_times",
                        userAvailableTimes
                      );
                    }}
                  >
                    {Array.from({ length: 24 }, (_, i) => i + 1)
                      .filter((o) => {
                        if (formik.values.time_in) {
                          return o > formik.values.time_in;
                        } else {
                          return true;
                        }
                      })
                      .map((item, idx) => (
                        <option value={item} key={idx}>
                          {`${item !== 24 ? item : 0}h`}
                        </option>
                      ))}
                  </CustomSelect>
                </Box>
                {/* <Button
                  padding={"0 "}
                  as="div"
                  display={item.time_in?.length > 0 ? "none" : "flex"}
                  minWidth="70px"
                  disabled={!item.show}
                  type="any"
                  onClick={() => {
                    if (
                      formik.values.time_available?.length > 0 &&
                      formik.values.time_in?.length > 0 &&
                      formik.values.time_until?.length > 0
                    ) {
                      formik.setTouched({
                        ...formik.touched,
                        ["time_in"]: false,
                        ["time_until"]: false,
                      });
                      item.time_in = formik.values.time_in;
                      item.time_until = formik.values.time_until;
                      item.show = false;
                      item.value = `${item.time_in} às ${item.time_until}`;

                      formik.setFieldValue(
                        "arr_available_times",
                        userAvailableTimes
                      );
                    } else {
                      formik.setTouched({
                        ...formik.touched,
                        ["time_in"]: true,
                        ["time_until"]: true,
                      });
                    }
                  }}
                  height="48px"
                  cursor="pointer"
                  style={{
                    backgroundColor: theme.color.white,
                    border: `2px solid ${theme.color.green}`,
                    color: theme.color.green,
                    fontSize: ".75rem",
                  }}
                >
                  {!item.show ? "Salvo" : "Salvar"}
                </Button> */}
                <DeleteBtn
                  paddingBottom=".5rem"
                  paddingLeft=".5rem"
                  aria-label="remove"
                  name="close"
                  onClick={() => {
                    let arr = userAvailableTimes;
                    remove(arr, arr[idx]);
                    formik.setFieldValue("arr_available_times", arr);
                    formik.setTouched({
                      ...formik.touched,
                      ["time_in"]: false,
                      ["time_until"]: false,
                    });
                  }}
                />
              </Box>
            </WrapUnavailableTimes>
          ))}
        </Box>
      </Grid>
      {!edit && (
        <Box padding={"1em"} display={"flex"}>
          <MyButton
            disabled={formik.isSubmitting || !isAuth}
            type="button"
            click={previousStep}
            className="previous"
            iconBefore={<CustomIcon icon="arrow-left" marginRight="7px" />}
            description="Voltar"
          />
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

export default ProfessionalExperience;

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

const CustomIcon = styled(Icon)`
  cursor: pointer;
  :hover,
  :focus {
    opacity: 0.8;
  }
`;

const Label = styled.label`
  margin-right: 5px;
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

const BoxAvatar = styled.div`
  position: relative;
  width: 60px;
  height: 60px;
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
`;

const LoadingImage = styled.div`
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
`;

const ImageProduct = styled.img`
  width: 60px;
  height: 60px;
  object-fit: cover;
  position: absolute;
  opacity: ${(props) => props.opacity};
`;

const DescriptionLink = styled.div`
  text-decoration: underline;
  padding-left: 5px;
  padding-right: 5px;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  width: 100px;
  align-items: center;
`;

const Grouping = styled.div`
  display: flex;
  align-items: center;
  input {
    margin-left: 15px;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    align-items: flex-start;
    flex-direction: column;
    input {
      margin-left: 0;
    }
  }
`;

const WrapUnavailableTimes = styled(Box)`
  margin: 0.5rem 0;
  width: 100%;
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

const CustomSelect = styled(Select)`
  height: 50px !important;
  border: 2px solid #eee !important;
`;
