import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  Flex,
  Image,
  Divider,
  Collapse,
  Button,
  Skeleton,
  Heading,
} from "@chakra-ui/react";
import { formatToBRL } from "brazilian-values";
import useWindowSize from "../hooks/useWIndowSize";
import { useStore, useActions } from "../configureStore";

//components
import Header from "../components/ProfessionalDetail/Header";
import MiniCardAboutUser from "../components/ProfessionalDetail/MiniCardAboutUser";
import AboutProfessional from "../components/ProfessionalDetail/AboutProfessional";
import WorkTypes from "../components/ProfessionalDetail/WorkTypes";
import ProfessionalAbilities from "../components/ProfessionalDetail/ProfessionalAbilities";
import GridComments from "../components/ProfessionalDetail/GridComments";
import BoxCallToAction from "../components/ProfessionalDetail/BoxCallToAction";
import CallToActionMobile from "../components/ProfessionalDetail/CallToActionMobile";

//assets
import noUser from "../assets/icons/nouser.svg";
import { downloadFile, FileNameMineExtension } from "../utils/helper";
import verifiedIcon from "../assets/icons/verified.svg";

const ProfessionalDetail = (props) => {
  const professional = useStore((state) => state.professional.professional);
  const user = useStore((state) => state.user.user);
  const isAuth = useStore((state) => state.auth.isAuthenticated);
  const getProfessional = useActions(
    (action) => action.professional.getProfessional
  );

  useEffect(() => {
    getProfessional(window.location.pathname?.split("/")[2]);
  }, []);

  const [top, setTop] = useState(0);
  const [position, setPosition] = useState("relative");
  const [openCollapse, setOpenCollapse] = useState(false);
  const { width } = useWindowSize();

  const calcPercentageBetweenTwoRanges = (value, min, max) =>
    ((Math.round(value) - min) * 100) / (max - min);
  const aboutUser = document.getElementById("aboutUser")?.offsetTop;

  useEffect(() => {
    let aboutUser = document.getElementById("aboutUser");
    let btnSeeAll = document.getElementById("seeAll");

    document.addEventListener("scroll", () => {
      requestAnimationFrame(() => {
        if (
          width >= 1024 &&
          window.pageYOffset > aboutUser?.offsetTop &&
          window.pageYOffset < btnSeeAll?.offsetTop - 300
        ) {
          setPosition("relative");
          setTop(
            calcPercentageBetweenTwoRanges(
              window.pageYOffset,
              aboutUser?.offsetTop,
              btnSeeAll?.offsetTop - 100
            )
          );
        } else {
          setPosition("relative");
        }
      });
    });
  }, []);

  const keys =
    professional?.user_available_times?.id &&
    Object.keys(professional?.user_available_times)?.filter((item) =>
      item?.includes("time")
    );

  const availableTimesMap = keys
    ?.map((item, idx) => professional?.user_available_times[item])
    ?.filter((item) => item?.length > 0);

  return (
    <Box>
      {width <= 440 && (
        <Box width="100%" display="flex" alignItems="center">
          <ImageUser
            src={
              professional?.image?.length > 0
                ? `${process.env.REACT_APP_ASSETS_BUCKET}/users/${professional?.image}`
                : noUser
            }
            margin="1rem auto"
          />
        </Box>
      )}
      <Container>
        {professional?.name?.length > 0 ? (
          <Title as="h1">
            {!isAuth
              ? professional.name?.split(" ")[0]
              : user.user_premium
              ? professional.name
              : professional.name?.split(" ")[0]}
          </Title>
        ) : (
          <MySkeleton height="30px" marginBottom="10px" />
        )}
        <Header
          district={professional?.address?.district}
          city={professional?.address?.city}
          country={professional?.address?.country}
        />
        {width >= 440 ? (
          <ImageUser
            src={
              professional?.image?.length > 0
                ? `${process.env.REACT_APP_ASSETS_BUCKET}/users/${professional?.image}`
                : noUser
            }
            margin="4rem 0"
          />
        ) : (
          <Divider borderColor="#ddd" borderWidth="2px" cursor="default" />
        )}
        <Grid>
          <Box cursor="default">
            {/* <MiniCardAboutUser />
            <Divider borderColor="#ddd" borderWidth="2px" cursor="default" /> */}
            <AboutProfessional
              data={professional?.user_info}
              viewSocialMedia={isAuth && user.user_premium ? true : false}
            />
            <Divider borderColor="#ddd" borderWidth="2px" cursor="default" />
            <Box>
              <Heading margin={"1rem 0"} fontSize="1.2rem" as="h4">
                Horários Disponiveis
              </Heading>
              {professional?.user_available_times?.sunday_time?.length > 0 && (
                <p>{`Domingo - ${professional?.user_available_times?.sunday_time}`}</p>
              )}
              {professional?.user_available_times?.monday_time?.length > 0 && (
                <p>{`Segunda-feira - ${professional?.user_available_times?.monday_time}`}</p>
              )}
              {professional?.user_available_times?.tuesday_time?.length > 0 && (
                <p>{`Terça-feira - ${professional?.user_available_times?.tuesday_time}`}</p>
              )}
              {professional?.user_available_times?.wednesday_time?.length >
                0 && (
                <p>{`Quarta-feira - ${professional?.user_available_times?.wednesday_time}`}</p>
              )}
              {professional?.user_available_times?.thursday_time?.length >
                0 && (
                <p>{`Quinta-feira - ${professional?.user_available_times?.thursday_time}`}</p>
              )}
              {professional?.user_available_times?.friday_time?.length > 0 && (
                <p>{`Sexta-feira - ${professional?.user_available_times?.friday_time}`}</p>
              )}
              {professional?.user_available_times?.saturday_time?.length >
                0 && (
                <p>{`Sábado - ${professional?.user_available_times?.saturday_time}`}</p>
              )}
            </Box>

            <Divider borderColor="#ddd" borderWidth="2px" cursor="default" />
            {professional?.categories?.length > 0 && (
              <>
                <WorkTypes
                  categories={professional?.categories}
                  width={width}
                />
                <Divider
                  borderColor="#ddd"
                  borderWidth="2px"
                  cursor="default"
                />
              </>
            )}
            <ProfessionalAbilities
              data={professional?.user_info}
              languages={professional?.user_language}
            />
          </Box>
          <BoxCallToAction
            display={width <= 768 ? "none" : "auto"}
            position={`${position}`}
            top={`${top}%`}
            // top={
            //   position?.includes("relative")
            //     ? `${aboutUser - 626}px`
            //     : `${top - 20}%`
            // }
            marginBottom={position?.includes("fixed") ? `0` : `2rem`}
          />
        </Grid>
        {professional?.user_info?.cv_link && (
          <>
            <Divider borderColor="#ddd" borderWidth="2px" cursor="default" />
            <Box>
              <Heading margin={"1rem 0"} fontSize="1.2rem" as="h4">
                Currículo
              </Heading>
              <LinkCustom
                href="#"
                onClick={() => {
                  downloadFile(
                    `${process.env.REACT_APP_ASSETS_BUCKET}/cv/${professional?.user_info?.cv_link}`
                  );
                }}
              >
                {FileNameMineExtension(professional?.user_info?.cv_link)}
              </LinkCustom>
            </Box>
          </>
        )}
        {professional?.reviews?.length > 0 && (
          <>
            <Divider borderColor="#ddd" borderWidth="2px" cursor="default" />
            <GridComments />
            <Divider borderColor="#ddd" borderWidth="2px" cursor="default" />
          </>
        )}
      </Container>
      <CallToActionMobile />
    </Box>
  );
};

export default ProfessionalDetail;

const Container = styled(Box)`
  min-height: 500px;
  cursor: pointer;
  padding: 4rem 0;
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 4rem 1rem;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    padding: 0rem 1rem 4rem 1rem;
  }
`;

const Title = styled(Box)`
  cursor: default;
  margin: 1rem 0 1rem 0;
  font-size: 2rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin: 0.5rem 0 0.5rem 0;
  }
`;

const ImageUser = styled(Image)`
  width: 260px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    width: 200px;
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    height: 250px;
    /* width: 100%; */
  }
`;

const Grid = styled(Box)`
  display: grid;
  grid-gap: 80px;
  grid-template-columns: 1fr 0.7fr;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    grid-template-columns: 1fr;
  }
`;

//skeleton loading

const MySkeleton = styled(Skeleton)`
  width: 10%;
  max-width: 300px;
`;

const LinkCustom = styled.a`
  height: 30px;
  line-height: 50px;
  font-weight: 400;
  text-decoration: none;
  color: #666;
  display: block;
  :hover {
    text-decoration: underline;
  }
  padding: 0 0 15px 0;
`;

const ImgVerified = styled.img`
  width: 32px;
`;
