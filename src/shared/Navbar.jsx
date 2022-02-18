import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  IconButton,
  Image,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useRef, useState } from "react";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Link, withRouter } from "react-router-dom";
import styled from "styled-components";
import { theme } from "../theme";
import { useActions, useStore } from "../configureStore";
import HomeFormSearch from "../components/Home/HomeFormSearch";
import ModalHomeFormSearch from "../components/Home/ModalHomeFormSearch";

// assets
import HelpPdf from "../assets/pdf/Ajuda.pdf";
import Logo from "../assets/images/logo-assist4.jpg";
import Wave from "../assets/images/wave.svg";
import Hamburguer from "../assets/icons/hamburguer.svg";
import heart from "../assets/icons/heart.svg";
import Carousel1 from "../assets/images/carousel/carousel-1.png";
import Carousel2 from "../assets/images/carousel/carousel-2.png";
import Carousel3 from "../assets/images/carousel/carousel-3.png";
import Carousel4 from "../assets/images/carousel/carousel-4.png";

const Navbar = (props) => {
  const isAuthenticated = useStore((state) => state.auth.isAuthenticated);
  const currentUser = useStore((state) => state.auth.user);
  const logout = useActions((actions) => actions.auth.clearAuth);
  const [idxText, setIdxText] = useState(0);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showModalSearch, setShowModalSearch] = useState(false);

  const drawerRef = useRef();

  const carouselImages = [Carousel1, Carousel2, Carousel3, Carousel4];

  const changeCarouselTitle = (idx) => {
    switch (idx) {
      case 0:
        return (
          <h1>
            Tudo para você cuidar <br />
            <b>da sua casa e da sua família</b>
          </h1>
        );
      case 1:
        return (
          <h1>
            Contato direto com <br />
            <b>diversos profissionais.</b>
          </h1>
        );
      case 3:
        return (
          <Text>
            <h1>
              Profissionais <br />
              <b>indicados e avaliados.</b>
            </h1>
          </Text>
        );
      default:
        return (
          <h1>
            Busque entre
            <br /> <b>diversos serviços.</b>
          </h1>
        );
    }
  };

  const changeCarouselText = (idx) => {
    switch (idx) {
      case 0:
        return (
          <Text>
            A tranquilidade para cumprir seus compromissos profissionais ciente
            de que sua família estará sendo cuidada.
          </Text>
        );
      case 1:
        return (
          <Text>É fácil, é rápido, você trata diretamente com quem faz.</Text>
        );
      case 2:
        return (
          <Text>
            Você atende às suas necessidades e contribui com projetos sociais.
          </Text>
        );
      case 3:
        return (
          <Text>
            A tranquilidade para cumprir seus compromissos profissionais ciente
            de que sua família estará sendo cuidada.
          </Text>
        );
      default:
        return (
          <Text>
            Cadastros indicados e que permitem que você confira a qualidade dos
            serviços prestados nas avaliações de outros clientes.
          </Text>
        );
    }
  };

  const changeRoute = (route) => {
    window.scrollTo(0, 0);
    props.history.push(route);
  };

  const pathname = window?.location?.pathname;

  return (
    <Container>
      <Content>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          height="100%"
        >
          <HeaderContainer>
            <Box display="flex">
              <HamburguerBtn
                ref={drawerRef}
                onClick={onOpen}
                src={Hamburguer}
              />
              <img
                height="55"
                src={Logo}
                alt="HomeAssist4u"
                onClick={() => props.history.push("/")}
              />
            </Box>
            {!isAuthenticated ? (
              <ContainerActions>
                <CustomLink to="/sobre-nos">Quem somos</CustomLink>
                <CustomLink to="/termos-e-condicoes">
                  Termos e condições
                </CustomLink>
                <CustomLink to="/politica-de-seguranca">
                  Política de privacidade
                </CustomLink>
                <BtnImAssistent
                  marginRight="16px"
                  onClick={() =>
                    props.history.push("/cadastro/wizard/profissional")
                  }
                >
                  INSCRIÇÃO DE PROFISSIONAL
                </BtnImAssistent>
                <BtnLogin onClick={() => props.history.push("/entrar")}>
                  Entrar
                </BtnLogin>
              </ContainerActions>
            ) : (
              <ContainerActions>
                <CustomLink to="/sobre-nos">Quem somos</CustomLink>
                <CustomLink to="/termos-e-condicoes">
                  Termos e condições
                </CustomLink>
                <CustomLink to="/politica-de-seguranca">
                  Política de privacidade
                </CustomLink>
                <Button
                  color={theme.color.white}
                  backgroundColor={theme.color.darkBlue}
                  variant="outline"
                  cursor="pointer"
                  marginRight={5}
                  _hover={{
                    backgroundColor: theme.color.white,
                    color: theme.color.darkBlue,
                    borderColor: theme.color.darkBlue,
                  }}
                  _focus={{
                    backgroundColor: theme.color.white,
                    color: theme.color.darkBlue,
                    borderColor: theme.color.darkBlue,
                  }}
                  onClick={() => props.history.push("/conta")}
                >
                  Meu Perfil
                </Button>
                <Button
                  color={theme.color.darkBlue}
                  backgroundColor={theme.color.white}
                  borderColor={theme.color.darkBlue}
                  variant="outline"
                  cursor="pointer"
                  onClick={logout}
                  _hover={{
                    backgroundColor: theme.color.darkBlue,
                    color: theme.color.white,
                    borderColor: theme.color.darkBlue,
                  }}
                  _focus={{
                    backgroundColor: theme.color.darkBlue,
                    color: theme.color.white,
                    borderColor: theme.color.darkBlue,
                  }}
                >
                  Sair
                </Button>
              </ContainerActions>
            )}
            {pathname?.includes("/profissionais/") &&
              pathname?.split("/")[2]?.length > 0 && (
                <WrapAction display="flex" alignItems="center">
                  {/* <LinkAction>
                    <Icon name="external-link" size="16px" />
                  </LinkAction> */}
                  <LinkAction marginRight={0}>
                    <Image src={heart} />
                  </LinkAction>
                </WrapAction>
              )}
            <BtnLoginMobile onClick={() => props.history.push("/entrar")}>
              Entrar
            </BtnLoginMobile>
          </HeaderContainer>
          <RowButtons>
            <BtnImAssistent
              marginRight="16px"
              onClick={() =>
                props.history.push("/cadastro/wizard/profissional")
              }
            >
              INSCRIÇÃO DE PROFISSIONAL
            </BtnImAssistent>
            {pathname === "/" && (
              <NavbarSearchAction
                icon={<SearchIcon height="20px" width="20px" />}
                onClick={() => setShowModalSearch(true)}
              />
            )}
          </RowButtons>
        </Box>
      </Content>
      <ContainerBottomNav
        show={
          !pathname?.includes("/profissionais") &&
          pathname !== "/conta" &&
          !pathname?.includes("/conta") &&
          pathname !== "/termos-e-condicoes" &&
          pathname !== "/quem-somos" &&
          pathname !== "/confirmacao_indicacao" &&
          pathname !== "/sobre-nos" &&
          pathname !== "/politica-de-seguranca" &&
          pathname !== "/conta/perfil" &&
          pathname !== "/entrar" &&
          pathname !== "/esqueceu-senha" &&
          pathname !== "/trocar-senha" &&
          pathname !== "/cadastro/home-assistant" &&
          pathname !== "/cadastro/profissional" &&
          pathname !== "/cadastro/wizard/profissional" &&
          pathname !== "/cadastro/wizard/home-assistant" &&
          pathname !== "/cadastro/wizard/" &&
          pathname !== "/cadastro" &&
          pathname !== "/cadastro/wizard" &&
          pathname !== "/dicas-seguranca" &&
          pathname !== "/home-assistants"
            ? "block"
            : "none"
        }
      >
        <Carousel
          showArrows={true}
          showStatus={false}
          showThumbs={false}
          showIndicators={false}
          infiniteLoop={true}
          width={"100%"}
          autoPlay={true}
          interval={10000}
          selectedItem={idxText}
          onChange={(e) => {
            setIdxText(e);
          }}
        >
          {carouselImages?.map((item, idx) => (
            <Box maxHeight={"546px"} key={idx}>
              <img draggable={false} src={item} alt="serviços" />
            </Box>
          ))}
        </Carousel>
        <WaveGreen>
          <Box
            display="flex"
            flexDirection="column"
            maxWidth="1280px"
            margin="0 auto"
          >
            {changeCarouselTitle(idxText)}
            {changeCarouselText(idxText)}
          </Box>
        </WaveGreen>
        <HomeFormSearch />
      </ContainerBottomNav>
      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader
            padding={"1rem"}
            borderBottomWidth="1px"
            display="flex"
            justifyContent="space-between"
          >
            <img src={Logo} width="70%" alt="HomeAssist4u" />
            <MyIconBtn icon="close" onClick={onClose} />
          </DrawerHeader>
          <DrawerBody padding={"1.5rem"}>
            {!isAuthenticated && (
              <LinkDrawer
                onClick={() => {
                  window.scrollTo(0, 0);
                  onClose();
                  return props.history?.push("/entrar");
                }}
              >
                <span>Entrar</span>
                <Icon
                  size="30px"
                  name="chevron-right"
                  color={theme.color.darkBlue}
                />
              </LinkDrawer>
            )}
            {isAuthenticated ? (
              <LinkDrawer
                onClick={() => {
                  window.scrollTo(0, 0);
                  onClose();
                  return props.history?.push("/conta");
                }}
              >
                <span>Meu Perfil</span>
                <Icon
                  size="30px"
                  name="chevron-right"
                  color={theme.color.darkBlue}
                />
              </LinkDrawer>
            ) : (
              <LinkDrawer
                onClick={() => {
                  window.scrollTo(0, 0);
                  onClose();
                  return props.history?.push("/cadastro/profissional");
                }}
              >
                <span>Cadastre-se como profissional</span>
                <Icon
                  size="30px"
                  name="chevron-right"
                  color={theme.color.darkBlue}
                />
              </LinkDrawer>
            )}
            <LinkDrawer
              onClick={() => {
                window.scrollTo(0, 0);
                onClose();
                return props.history?.push("/politica-de-seguranca");
              }}
            >
              <span>Política de privacidade</span>
              <Icon
                size="30px"
                name="chevron-right"
                color={theme.color.darkBlue}
              />
            </LinkDrawer>
            <LinkDrawer
              onClick={() => {
                window.scrollTo(0, 0);
                onClose();
                return props.history?.push("/termos-e-condicoes");
              }}
            >
              <span>Termos e condições</span>
              <Icon
                size="30px"
                name="chevron-right"
                color={theme.color.darkBlue}
              />
            </LinkDrawer>
            <LinkDrawer
              onClick={() => {
                window.scrollTo(0, 0);
                onClose();
                window.open(HelpPdf, "_blank");
              }}
            >
              <span>Ajuda</span>
              <Icon
                size="30px"
                name="chevron-right"
                color={theme.color.darkBlue}
              />
            </LinkDrawer>
            {isAuthenticated && (
              <LinkDrawer onClick={logout}>
                <span>Sair</span>
                <Icon
                  size="30px"
                  name="chevron-right"
                  color={theme.color.darkBlue}
                />
              </LinkDrawer>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
      <ModalHomeFormSearch
        onClose={() => setShowModalSearch(false)}
        isOpen={showModalSearch}
      />
    </Container>
  );
};

export default withRouter(Navbar);

const Container = styled(Box)``;

const Content = styled(Box)`
  box-shadow: 1px 1px 10px rgba(0, 0, 0, 0.1);
  height: 80px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    height: 135px;
  }
`;

const HeaderContainer = styled(Box)`
  max-width: 1280px;
  margin: 0 auto;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    cursor: pointer;
    max-width: 280px;
    max-height: 51px;
  }

  @media (max-width: ${(props) => props.theme.queries.xl}) {
    margin: 1rem 1em 0.7rem 1em;
    width: 90%;
  }

  @media (max-width: ${(props) => props.theme.queries.lg}) {
    img {
      max-width: 200px;
      max-height: 31px;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    height: auto;
  }
`;

const HamburguerBtn = styled(Image)`
  display: none;
  height: 50px;
  width: 30px;
  cursor: pointer;
  margin-right: 1rem;
  &:hover {
    opacity: 0.8;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: block;
  }
`;

const MyIconBtn = styled(IconButton)`
  border: none;
  background-color: ${(props) => props.theme.color.white} !important;
  color: ${(props) => props.theme.color.darkBlue};
  box-shadow: none !important;
  cursor: pointer;
  svg {
    width: 20px;
    height: 20px;
  }
  &:hover {
    opacity: 0.6;
  }
`;

const LinkDrawer = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.3s;
  height: 45px;
  cursor: pointer;
  span {
    font-weight: bold;
    color: ${(props) => props.theme.color.darkBlue};
  }
  &:hover {
    opacity: 0.6;
  }
`;

//ACTIONS

const ContainerActions = styled(Box)`
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: none;
  }
`;

const CustomLink = styled(Link)`
  font-weight: 600;
  color: ${(props) => props.theme.color.darkBlue};
  font-size: 1.125rem;
  line-height: 1.5625rem;
  text-decoration: none;
  margin-right: 44px;
  transition: 0.3s;
  :hover {
    opacity: 0.7;
    text-decoration: underline;
  }
`;

const CustomButton = styled(Button)`
  border-radius: 0.2rem !important;
  height: 48px !important;
  font-size: 1.125rem;
  line-height: 1 !important;
  cursor: pointer;
`;

const BtnImAssistent = styled(CustomButton)`
  color: ${(props) => props.theme.color.white};
  background-color: ${(props) => props.theme.color.green} !important;
  font-size: 0.9rem;
  border: none;
  &:hover {
    opacity: 0.5;
  }

  @media (max-width: 1024px) {
    padding: 0.5rem !important;
    font-size: 0.9rem !important;
    height: 40px !important;
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    padding: 0.5rem !important;
    font-size: 0.9rem !important;
    height: 40px !important;
  }
`;

const BtnLogin = styled(CustomButton)`
  background-color: ${(props) => props.theme.color.darkBlue} !important;
  color: ${(props) => props.theme.color.white} !important;
  border: none !important;
  width: 83px;
  &:hover {
    background-color: ${(props) => props.theme.color.white} !important;
    color: ${(props) => props.theme.color.darkBlue} !important;
    border: 2px solid ${(props) => props.theme.color.darkBlue} !important;
  }
`;

// Bottom navbar

const ContainerBottomNav = styled(Box)`
  display: ${(props) => (props.show !== "undefined" ? props.show : "block")};
  height: 540px;
  width: 100%;
  background-color: ${(props) => props.theme.color.lightGray};
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    height: 500px;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    height: 365px;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    height: 300px;
  }
`;

const WaveGreen = styled(Box)`
  position: relative;
  background-image: url(${Wave});
  background-size: cover;
  height: 201px;
  bottom: 248.54px;
  padding-top: 3rem;

  h1 {
    margin: 0;
    color: ${(props) => props.theme.color.white};
    font-weight: 500;
    font-size: 2.2rem;
    line-height: 2.8rem;
    text-align: left;
  }

  p {
    font-size: 1.25rem;
    line-height: 1.875rem;
    color: ${(props) => props.theme.color.gray};
    max-width: 670px;
    text-align: left;
    margin: 10px 0 0 0;
  }

  @media (min-width: 2000px) {
    height: 250px;
    bottom: 290px;
    h1 {
      margin-top: 2rem;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.xl}) {
    bottom: 242px;
    height: 160px;
    padding: 3rem;
  }

  @media (max-width: ${(props) => props.theme.queries.lg}) {
    bottom: 150px;
    height: 130px;
    padding: 2rem 3rem 3rem 3rem;
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    bottom: 120px;
    height: 100px;
    padding: 2rem 3rem 3rem 3rem;
    h1 {
      font-size: 2rem;
      line-height: 2.3rem;
    }

    p {
      font-size: 1rem;
      line-height: 1.3rem;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    bottom: 50px;
    height: 110px;
    padding: 2rem 1rem 3rem 2rem;
    h1 {
      font-size: 1.3rem;
      line-height: 1.5rem;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.i5}) {
    h1 {
      font-size: 1.1rem;
    }
  }
`;

const NavbarSearchAction = styled(IconButton)`
  display: none !important;
  background-color: ${(props) => props.theme.color.green} !important;
  color: ${(props) => props.theme.color.white} !important;
  border: none;

  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: block !important;
  }
`;

//professional action

const LinkAction = styled(Box)`
  display: flex;
  border-radius: 0.3rem;
  margin-right: 1rem;
  padding: 0.3rem 0.3rem;
  transition: 0.3s;

  img {
    width: 16px;
    height: 16px;
  }

  :hover,
  :focus {
    background-color: #eee;
  }
`;

const WrapAction = styled(Box)`
  @media (min-width: ${(props) => props.theme.queries.md}) {
    display: none !important;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    display: flex !important;
  }
`;

//modal

const CustomCloseModal = styled(ModalCloseButton)`
  cursor: pointer;
  border: none !important;
  background-color: transparent !important;
  top: 20px !important;
  right: 20px !important;
  left: 20px !important;
  svg {
    height: 15px !important;
    width: 15px !important;
  }
`;

const CustomModalBody = styled(ModalBody)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    input {
      width: 90%;
    }
    button {
      margin-left: 36% !important;
      margin-bottom: 1rem;
    }
  }
`;

//MOBILE

const RowButtons = styled(Box)`
  display: none;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  margin-top: 0.3rem;
  width: 90%;

  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: flex;
  }
`;

const BtnLoginMobile = styled(BtnLogin)`
  display: none !important;

  @media (max-width: ${(props) => props.theme.queries.md}) {
    display: block !important;
  }
`;
