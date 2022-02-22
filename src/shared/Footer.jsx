/* eslint-disable react/jsx-no-target-blank */
import React from "react";
import styled from "styled-components";
import { withRouter, Link } from "react-router-dom";
import { Box, Text, Image } from "@chakra-ui/react";

import Instagram from "../assets/icons/instagram.svg";
import Facebook from "../assets/icons/facebook.svg";
import securityPdf from "../assets/pdf/security.pdf";

const Footer = (props) => {
  return (
    <Container>
      <MainFooter>
        <BoxContentOne>
          <ColItems>
            <Text marginBottom={"24px"} fontWeight={600}></Text>
            <CustomLink to="/termos-e-condicoes">Termos e condições</CustomLink>
            <CustomLink to="/politica-de-seguranca">
              Política de privacidade
            </CustomLink>
            <CustomLink to="/sobre-nos">Sobre nós</CustomLink>
            <CustomLink to="/dicas-seguranca">Dicas de Segurança</CustomLink>
            <CustomLink to="/home-assistants">Home Assistants</CustomLink>
          </ColItems>
        </BoxContentOne>
        <BoxContentTwo>
          <Acompanhe marginTop={0}>
            Acompanhe ou entre em contato pelas nossas redes sociais:
          </Acompanhe>
          <Box width="300px" display="flex" alignItems="center">
            <SocialIcon marginRight={"16px"} src={Instagram} alt="instagram" />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.instagram.com/homeassist4ureal/"
            >
              Instagram: @homeassist4ureal
            </a>
          </Box>
          <Box width="300px" display="flex" alignItems="center">
            <SocialIcon marginRight={"16px"} src={Facebook} alt="facebook" />
            <a
              target="_blank"
              rel="noreferrer"
              href="https://www.facebook.com/homeassist4ureal"
            >
              Facebook: homeassist4ureal
            </a>
          </Box>
        </BoxContentTwo>
      </MainFooter>
      <SubFooter>
        <SubFooterContent>
          <span>contato@homeassist4u.com</span>
        </SubFooterContent>
      </SubFooter>
    </Container>
  );
};

export default withRouter(Footer);

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  background: linear-gradient(164.47deg, #a5ef42 1.59%, #8cc73d 98.89%);
`;

const MainFooter = styled.div`
  min-height: 349px;
  max-width: ${(props) => props.theme.queries.xl};
  width: 100%;
  margin: 0 auto;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    width: auto;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    grid-template-columns: 100%;
  }
`;

const BoxContentOne = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 83px;

  @media (max-width: ${(props) => props.theme.queries.lg}) {
    grid-gap: 60px;
  }

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: 1fr;
  }
`;

const ColItems = styled(Box)`
  display: flex;
  flex-direction: column;
  p {
    color: ${(props) => props.theme.color.white};
    font-size: 1.125rem;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 0 1rem;
  }
`;

const CustomLink = styled(Link)`
  color: ${(props) => props.theme.color.white};
  font-size: 1rem;
  line-height: 2rem;
  margin-bottom: 0.3rem;
  text-decoration: none;
`;

const LinkDicasSeguranca = styled.a`
  color: ${(props) => props.theme.color.white};
  font-size: 1rem;
  line-height: 2rem;
  margin-bottom: 0.3rem;
  text-decoration: none;
`;

const BoxContentTwo = styled(Box)`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 15px;
  justify-items: flex-end;

  img {
    width: 48px;
    height: 48px;
  }

  p,
  a {
    color: ${(props) => props.theme.color.white};
    font-size: 1.125rem;
    text-decoration: none;
  }

  a {
    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    margin: 1rem 0;
    justify-items: flex-start;
    padding: 0 1rem;
  }
`;

const Acompanhe = styled(Text)`
  width: 300px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    width: auto;
  }
`;

const SocialIcon = styled(Image)`
  height: 48px;
  width: 48px;
`;
//subfooter

const SubFooter = styled.div`
  display: flex;
  align-items: center;
  height: 56px;
  background-color: ${(props) => props.theme.color.green};
`;

const SubFooterContent = styled(Box)`
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;

  span {
    font-size: 1rem;
    line-height: 1.375rem;
    color: ${(props) => props.theme.color.white};
  }

  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 0 1em;
  }
  @media (max-width: ${(props) => props.theme.queries.i5}) {
    flex-direction: column;
  }
`;
