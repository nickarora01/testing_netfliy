import React, { useEffect } from "react";
import styled from "styled-components";
import { Label } from "evergreen-ui";
import { Input, Button, Alert, AlertIcon } from "@chakra-ui/react";
import { FormattedMessage } from "react-intl";
import { useFormik } from "formik";
import { useStore, useActions } from "../configureStore";

export default function Login(props) {
  const isLoading = useStore((state) => state.auth.isAuthLoading);
  const authError = useStore((state) => state.auth.authError);
  const updateError = useActions((state) => state.auth.updateAuthError);
  const login = useActions((actions) => actions.auth.authenticateUser);

  useEffect(() => {
    if (authError) {
      setTimeout(() => {
        updateError("");
      }, 6000);
    }
  }, [authError]);

  const validate = (values) => {
    const err = {};

    const message = "Campo obrigatório";

    if (!values.email) err.email = message;
    if (!values.password) err.password = message;

    return err;
  };

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values, { setSubmitting }) => {
      login(values);
      setSubmitting(false);
      formik.resetForm();
    },
    validate,
  });

  return (
    <Content>
      <Header>
        <HeaderWelcome>
          <h2>Entrar</h2>
        </HeaderWelcome>
      </Header>
      {authError && (
        <Alert status="error">
          <AlertIcon />
          {authError}
        </Alert>
      )}
      <div>
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
              <Label
                htmlFor={45}
                size={500}
                display="block"
                marginBottom={0}
                marginTop={15}
              >
                <FormattedMessage id="app.senha" defaultMessage="Senha" />
              </Label>
              <CustomInput
                isInvalid={
                  !!formik.errors.password &&
                  formik.touched.password &&
                  !!formik.errors.password
                }
                id="password"
                height={45}
                name="password"
                type="password"
                onChange={formik.handleChange}
                value={formik.values.password}
                placeholder="Senha"
                readOnly="readonly"
                onFocus={(event) => {
                  event.target.removeAttribute("readonly");
                }}
                autoComplete="off"
              />
              <MessageError>
                {formik.errors.password &&
                  formik.touched.password &&
                  formik.errors.password}
              </MessageError>
              <CustomButton
                type="submit"
                disabled={formik.isSubmitting}
                loading={isLoading ? true : false}
              >
                <LabelButton>
                  <FormattedMessage
                    id="app.fazerLogin"
                    defaultMessage="Fazer Login"
                  />
                </LabelButton>
              </CustomButton>
            </ContentForm>
          </form>
          <BoxLink>
            <LinkCustom onClick={() => props.history.push("/esqueceu-senha")}>
              <FormattedMessage
                id="app.esqueciMinhaSenha"
                defaultMessage="Esqueci Minha Senha"
              />
            </LinkCustom>
          </BoxLink>
        </Box>
        <BoxRight>
          <Title>
            {/* <FormattedMessage
              id="app.torneseMembro"
              defaultMessage="Torne-se um membro"
            /> */}
            Aqui você encontra a solução que vai facilitar a sua vida!
          </Title>
          <ContentForm>
            {/* <ul>
              <ListItem>Lorem ipsum dolor sit amet</ListItem>
              <ListItem>Lorem ipsum dolor sit amet</ListItem>
              <ListItem>Lorem ipsum dolor sit amet</ListItem>
              <ListItem>Lorem ipsum dolor sit amet</ListItem>
            </ul> */}
            <CustomButton
              type="button"
              onClick={() => props.history.push("/cadastro/wizard")}
            >
              <LabelButton>
                <FormattedMessage
                  id="app.cadastreSe"
                  defaultMessage="CADASTRE-SE"
                />
              </LabelButton>
            </CustomButton>
          </ContentForm>
        </BoxRight>
      </div>
    </Content>
  );
}

const Content = styled.div`
  max-width: 1280px;
  min-height: 600px;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  flex-direction: column;
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
`;

const BoxRight = styled(Box)`
  align-items: flex-end;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    align-items: flex-start;
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
    margin: 0.8em 0 0.5em 0;
  }
`;

const Title = styled.h2`
  min-width: 300px;
  max-width: 420px;
  font-size: 20px;
  font-weight: 800;
  font-style: normal;
  font-stretch: normal;
  line-height: 30px;
  text-align: left;
  padding: 15px 0px;
  margin: 0;
  text-transform: uppercase;
  color: ${(props) => props.theme.color.primary};
  @media (max-width: ${(props) => props.theme.queries.md}) {
    max-width: 100%;
  }
`;

const ContentForm = styled.div`
  display: flex;
  flex-direction: column;

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

const ListItem = styled.li`
  &:before {
    content: "•";
    font-weight: bold;
    display: inline-block;
    width: 1em;
    margin-left: -1em;
    color: ${(props) => props.theme.color.primary};
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
  background-color: ${(props) => props.theme.color.primary} !important;
  border: 0;
  min-height: 50px;
  transition: 0.3s;
  color: #fff;
  letter-spacing: 1px;
  font-size: 0.8125rem !important;
  text-transform: uppercase;
  cursor: pointer;
  margin-top: 2rem;
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

const BoxLink = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 2em;
  margin-left: 0;
  cursor: pointer;
`;

const LinkCustom = styled.a`
  height: 30px;
  line-height: 30px;
  font-size: 15px;
  font-weight: 600;
  color: ${(props) => props.theme.color.primary};
  text-decoration: underline;
`;
