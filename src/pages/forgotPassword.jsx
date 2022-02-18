import React, { useEffect } from "react";
import styled from "styled-components";
import { Input, Button, AlertIcon } from "@chakra-ui/react";
import { useFormik } from "formik";
import { Label, Alert } from "evergreen-ui";
import { useHistory } from "react-router-dom";
import { useStore, useActions } from "../configureStore";

export default function ForgotPassword() {
  const history = useHistory();
  const isLoading = useStore((state) => state.auth.isAuthLoading);
  const authError = useStore((state) => state.auth.authError);
  const msgForgot = useStore((state) => state.auth.msgForgot);
  const updateError = useActions((state) => state.auth.updateAuthError);
  const forgotPassword = useActions((actions) => actions.auth.forgotPassword);

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        updateError("");
      }, 4000);
    }
  }, [authError]);

  const validate = (values) => {
    const err = {};

    const message = "Campo obrigatório";

    if (!values.email) err.email = message;

    return err;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      values.email = values.email.trim();
      forgotPassword(values);
      setSubmitting(false);
      setTimeout(() => {
        formik.resetForm();
      }, 2000);
    },
    validate,
  });

  return (
    <Content>
      <Header>
        <HeaderWelcome>
          <h2>Esqueceu a senha</h2>
        </HeaderWelcome>
      </Header>
      {msgForgot && (
        <Alert
          intent="success"
          style={{ lineHeight: "1.3" }}
          title={msgForgot}
        />
      )}
      {authError && (
        <Alert
          intent="danger"
          style={{ lineHeight: "1.3" }}
          title={authError}
        />
      )}
      <Box>
        <form onSubmit={formik.handleSubmit}>
          <ContentForm>
            <Label
              htmlFor={45}
              size={500}
              display="block"
              marginBottom={0}
              marginTop={15}
            >
              Login/E-mail
            </Label>
            <CustomInput
              isInvalid={
                !!formik.errors.email &&
                formik.touched.email &&
                !!formik.errors.email
              }
              height={45}
              name="email"
              type="email"
              placeholder="Email"
              autoComplete={"off"}
              readOnly="readonly"
              onFocus={(event) => {
                event.target.removeAttribute("readonly");
              }}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.email}
            />
            <MessageError>
              {formik.errors.email &&
                formik.touched.email &&
                formik.errors.email}
            </MessageError>
          </ContentForm>
          <BoxCenterLink>
            <LinkCustom onClick={() => history.push("/entrar")}>
              Lembrou da senha?
            </LinkCustom>
          </BoxCenterLink>
          <CustomButton
            type="submit"
            disabled={formik.isSubmitting}
            loading={isLoading}
          >
            <LabelButton>{isLoading ? "ENVIANDO" : "ENVIAR"}</LabelButton>
          </CustomButton>
        </form>
      </Box>
    </Content>
  );
}

const Content = styled.div`
  width: 420px;
  min-height: 600px;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  > div + div {
    display: flex;
    flex-direction: row;
  }
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 0 1rem;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    > div + div {
      flex-direction: column;
    }
  }
`;

const Box = styled.div`
  height: auto;
  width: 100%;
  border-radius: 2px;
  position: relative;
  transition-delay: 0.5s;
  display: flex;
  flex-direction: column;

  form {
    width: 100%;
  }
`;

const Header = styled.div`
  color: #333;
`;

const HeaderWelcome = styled.div`
  h2 {
    font-size: 35px;
    font-weight: bold;
    color: ${(props) => props.theme.color.primary};
    margin: 0.8em 0 0.8em 0;
  }
`;

const ContentForm = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  > ul {
    min-width: 400px;
    list-style: none;
    padding-left: 1em;
  }

  label {
    color: ${(props) => props.theme.color.primary};
    font-weight: bold;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    width: 100%;
  }
`;

const MessageError = styled.span`
  transition: 0.2s ease-in-out;
  margin-bottom: 5px;
  margin-left: 5px;
  color: ${(props) => props.theme.color.red};
  font-size: 1em;
`;

const CustomInput = styled(Input)`
  margin-top: 0.5rem;
  border: 2px solid #eee !important;
  width: auto !important;
`;

const CustomButton = styled(Button)`
  width: 100%;
  background-color: ${(props) => props.theme.color.primary} !important;
  border: 0;
  min-height: 50px;
  transition: 0.3s;
  color: #fff;
  letter-spacing: 1px;
  font-size: 0.8125rem !important;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 1rem;
  outline: 0;
  opacity: ${(props) => (props.loading ? 0.8 : 1)};
  &:hover {
    opacity: 0.8;
  }
`;

const LabelButton = styled.span`
  height: 42px;
  line-height: 42px;
  font-size: 1.5em;
  font-weight: bold;
`;

const LinkCustom = styled.a`
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.color.primary};
  text-decoration: underline;
  cursor: pointer;
`;

const BoxCenterLink = styled.div`
  height: 50px;
  text-align: center;
  padding: 1em 1em 1em 1em;
  a {
    font-size: 17px;
  }
`;
