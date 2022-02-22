import React, { useEffect } from "react";
import styled from "styled-components";
import { Formik } from "formik";
import { Input, Button } from "@chakra-ui/react";
import { Label } from "evergreen-ui";
import queryString from "query-string";
import { useStore, useActions } from "../configureStore";
import { PasswordTest } from "../utils/helper";

export default function ChangePassword(props) {
  const isLoading = useStore((state) => state.auth.isAuthLoading);
  const authError = useStore((state) => state.auth.authError);
  const updateError = useActions((state) => state.auth.updateAuthError);
  const changePassword = useActions((actions) => actions.auth.changePassword);
  const query = queryString.parse(props.location.search);
  const token = query.token;

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        updateError("");
      }, 4000);
    }
  }, [authError]);

  return (
    <Content>
      <Header>
        <HeaderWelcome>
          <h2>Trocar a senha</h2>
        </HeaderWelcome>
      </Header>
      <Box>
        <Formik
          initialValues={{ password: "", confirmPassword: "" }}
          validate={(values) => {
            let errors = {};
            if (!values.password) {
              errors.password = "Obrigatório";
            }
            if (!values.confirmPassword) {
              errors.confirmPassword = "Obrigatório";
            }
            if (values.password !== values.confirmPassword) {
              errors.confirmPassword = "As senhas são diferentes";
            }
            if (!PasswordTest(values.password)) {
              errors.password =
                "Senha deve conter letras maiúsculas e minúsculas, números e caracteres especiais (@$!%*?&#)";
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            changePassword({
              password: values.password,
              token,
            });
            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <ContentForm>
                {authError && <MessageError>{authError}</MessageError>}
                <Label
                  htmlFor={45}
                  size={500}
                  display="block"
                  marginBottom={3}
                  marginTop={15}
                >
                  Nova Senha
                </Label>
                <CustomInput
                  height={45}
                  name="password"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                  placeholder="Nova Senha"
                  autoComplete={"off"}
                />
                <MessageError>
                  {errors.password && touched.password && errors.password}
                </MessageError>
                <Label
                  htmlFor={45}
                  size={500}
                  display="block"
                  marginBottom={3}
                  marginTop={15}
                >
                  Confirmar Senha
                </Label>
                <CustomInput
                  height={45}
                  name="confirmPassword"
                  type="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.confirmPassword}
                  placeholder="Confirmar Senha"
                  autoComplete={"off"}
                />
                <MessageError>
                  {errors.confirmPassword &&
                    touched.confirmPassword &&
                    errors.confirmPassword}
                </MessageError>
              </ContentForm>
              <CustomButton
                type="submit"
                disabled={isSubmitting}
                loading={isLoading}
              >
                <LabelButton>{isLoading ? "ENVIANDO" : "ENVIAR"}</LabelButton>
              </CustomButton>
            </form>
          )}
        </Formik>
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
