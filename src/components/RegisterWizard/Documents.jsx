import { Box, Input, Spinner, Textarea } from "@chakra-ui/react";
import { useFormik } from "formik";
import React, { useState, useEffect } from "react";
import { Rifm } from "rifm";
import styled from "styled-components";
import {
  Checkbox as EverCheckbox,
  Icon,
  Tooltip,
  InfoSignIcon,
} from "evergreen-ui";
import useWindowSize from "../../hooks/useWIndowSize";
import {
  formatDate,
  formatFile,
  formatNIF,
  formatZip,
} from "../../utils/helper";
import MyInput from "./MyInput";
import MyRadio from "./MyRadio";
import districtJson from "../../json/portugal_district.json";
import MySelect from "./MySelect";
import { useStore } from "easy-peasy";
import MyButton from "./MyButton";
import ContextSelect from "../ContextSelect";
import { Upload } from "../../utils/upload";
import { useActions } from "../../configureStore";
import DocumentIcon from "../../assets/icons/driver-license.svg";
import NoUser from "../../assets/icons/nouser.svg";
import { CloseIcon } from "@chakra-ui/icons";
import LabelWithTooltip from "../../components/LabelWithTooltip";

const Documents = (props) => {
  const getMe = useActions((action) => action.user.getMe);
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

  const { width } = useWindowSize();
  const {
    values,
    nextStep,
    previousStep,
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
      document_image: values?.user_info?.document_image || null,
      document_image2: values?.user_info?.document_image2 || null,
      photo: values?.image || null,
      father_name: values?.user_info?.father_name || "",
      mother_name: values?.user_info?.mother_name || "",
      city_born: values?.user_info?.city_born || "",
      country_born: values?.user_info?.country_born || "",
    },
    enableReinitialize: true,
    onSubmit: async (values, { setSubmitting }) => {
      const auth = JSON.parse(localStorage.getItem("4you_auth"));
      const payload = payloader(values);
      await save({ payload, id: auth?.user?.id || 0, step: 3, edit: false });
      setSubmitting(false);
    },
    validate: (values) => {
      const err = {};
      const message = "Campo obrigatório";

      if (!values.father_name) err.father_name = message;
      if (!values.mother_name) err.mother_name = message;
      if (!values.city_born) err.city_born = message;
      if (!values.country_born) err.country_born = message;
      if (!values.photo) err.photo = message;
      if (!values.document_image) err.document_image = message;
      if (!values.document_image2) err.document_image2 = message;

      return err;
    },
  });

  formik = edit ? _formik : formik;

  return (
    <MyForm onSubmit={formik.handleSubmit} autocomplete="off">
      <Grid width={width}>
        <Box>
          <LabelWithTooltip
            label="Cópia do Documento"
            infoMessage="Envie cópia em JPG ou PDF da frente e do verso do mesmo documento informado anteriormente. Caso todo o documento esteja em um único ficheiro/arquivo, coloque no local definido como frente. Informação Restrita"
          />
          <Box
            display="flex"
            alignItems="flex-end"
            flexDirection={width <= 440 ? "column" : "row"}
          >
            {formik.values.document_image?.length > 0 ? (
              <Box
                display="flex"
                alignItems="center"
                width={width <= 440 ? "100%" : "initial"}
              >
                <BoxAvatar>
                  {!loadingImageDocument ? (
                    <InputImage
                      type="file"
                      onChange={(e) => doUpload(e)}
                      accept="image/*, .pdf"
                    />
                  ) : null}
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
                <DescriptionLink>
                  {formatFile(formik.values.document_image)}
                </DescriptionLink>
                {formik.values.document_image && (
                  <DeleteBtn
                    aria-label="remove"
                    name="close"
                    onClick={() => {
                      formik.setFieldValue("document_image", null);
                    }}
                  />
                )}
              </Box>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                width={width <= 440 ? "100%" : "initial"}
              >
                <BoxAvatar style={{ backgroundColor: "#fff" }}>
                  {!loadingImageDocument ? (
                    <InputImage
                      type="file"
                      onChange={(e) => doUpload(e)}
                      accept="image/*, .pdf"
                    />
                  ) : null}
                  {loadingImageDocument ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct src={DocumentIcon} />
                  )}
                </BoxAvatar>
                <MessageError>{formik.errors.document_image}</MessageError>
              </Box>
            )}

            {formik.values.document_image2?.length > 0 ? (
              <Box
                display="flex"
                alignItems="center"
                width={width <= 440 ? "100%" : "initial"}
              >
                <BoxAvatar>
                  {!loadingImageDocument2 ? (
                    <InputImage
                      type="file"
                      onChange={(e) => doUpload2(e)}
                      accept="image/*, .pdf"
                    />
                  ) : null}
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
                <DescriptionLink>
                  {formatFile(formik.values.document_image2)}
                </DescriptionLink>
                {formik.values.document_image2 && (
                  <DeleteBtn
                    aria-label="remove"
                    name="close"
                    onClick={() => {
                      formik.setFieldValue("document_image2", null);
                    }}
                  />
                )}
              </Box>
            ) : (
              <Box
                display="flex"
                alignItems="center"
                width={width <= 440 ? "100%" : "initial"}
              >
                <BoxAvatar style={{ backgroundColor: "#fff" }}>
                  {!loadingImageDocument2 ? (
                    <InputImage
                      type="file"
                      onChange={(e) => doUpload2(e)}
                      accept="image/*, .pdf"
                    />
                  ) : null}
                  {loadingImageDocument2 ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct src={DocumentIcon} />
                  )}
                </BoxAvatar>
                <MessageError>{formik.errors.document_image2}</MessageError>
              </Box>
            )}
          </Box>
        </Box>
        <Box>
          <LabelWithTooltip
            label="Foto de perfil"
            infoMessage="Envie uma boa foto do seu rosto. Não aceitamos logomarcas ou outras imagens diferentes"
          />
          <Box display="flex" alignItems="flex-end">
            {formik.values.photo?.length > 0 ? (
              <Box display="flex" alignItems="center">
                <BoxAvatar>
                  {!loadingImage ? (
                    <InputImage
                      name="photo"
                      type="file"
                      onChange={(e) => {
                        doUploadImageUser(e);
                      }}
                      accept="image/*"
                    />
                  ) : null}
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
                {formatFile(formik.values.photo)}
                <DescriptionLink></DescriptionLink>
                {formik.values.photo && (
                  <DeleteBtn
                    aria-label="remove"
                    name="close"
                    onClick={() => {
                      formik.setFieldValue("photo", null);
                    }}
                  />
                )}
              </Box>
            ) : (
              <Box display="flex" alignItems="center">
                <BoxAvatar style={{ backgroundColor: "#fff" }}>
                  {!loadingImage ? (
                    <InputImage
                      name="photo"
                      type="file"
                      onChange={(e) => {
                        doUploadImageUser(e);
                      }}
                      accept="image/*"
                    />
                  ) : null}
                  {loadingImage ? (
                    <LoadingImage>
                      <Spinner />
                    </LoadingImage>
                  ) : (
                    <ImageProduct src={NoUser} />
                  )}
                </BoxAvatar>
                <MessageError>{formik.errors.photo}</MessageError>
              </Box>
            )}
          </Box>
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
          placeholderTemplate="Insira o"
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Escreva como aparece em seu documento de identificação. Caso o espaço esteja em branco, digite EM BRANCO – Informação Restrita"
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
          placeholderTemplate="Insira o"
          value={formik.values.mother_name}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Escreva como aparece em seu documento de identificação. Caso o espaço esteja em branco, digite EM BRANCO – Informação Restrita"
        />
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
          placeholderTemplate="Insira o"
          value={formik.values.city_born}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          infoMessage="Se não nasceu em Portugal, escreva o equivalente em seu país de origem - Por exemplo: no Brasil é Estado e nos Estados Unidos é State – Informação Restrita"
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
          placeholderTemplate="Insira o"
          value={formik.values.country_born}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
      </Grid>
      {!edit && (
        <Box padding={"1em"} display={"flex"}>
          <MyButton
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

export default Documents;

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

const Label = styled.label`
  margin-right: 5px;
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
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

const DeleteBtn = styled(CloseIcon)`
  border: none !important;
  height: 35px !important;
  margin-right: 7.5px;
  cursor: pointer;
  path {
    fill: ${(props) => props.theme.color.red};
  }
`;
