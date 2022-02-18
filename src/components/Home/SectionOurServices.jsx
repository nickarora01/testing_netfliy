import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { Box, Text, Image } from "@chakra-ui/react";
import useWindowSize from "../../hooks/useWIndowSize";

import MenuHome from "../../components/Home/MenuHome";
import ModalOurServicesMobile from "../../components/Home/ModalOurServicesMobile";

import house from "../../assets/icons/home/services-house.svg";
import family from "../../assets/icons/home/services-family.svg";
import forYou from "../../assets/icons/home/services-for-you.svg";
import { CrossIcon } from "evergreen-ui";

const SectionBackButtons = (props) => {
  return (
    <ContainerBackButtons className={"back-buttons"}>
      {!(props.select === 1) && (
        <Image
          draggable={false}
          src={house}
          alt="serviço para sua casa"
          onClick={() => {
            props.clickSelect(1);
          }}
        />
      )}
      {!(props.select === 2) && (
        <Image
          draggable={false}
          src={family}
          alt="serviço para sua familia"
          onClick={() => {
            props.clickSelect(2);
          }}
        />
      )}
      {!(props.select === 3) && (
        <Image
          draggable={false}
          src={forYou}
          alt="serviço para você"
          onClick={() => {
            props.clickSelect(3);
          }}
        />
      )}
      <CrossIcon
        color="disabled"
        onClick={() => {
          props.clickSelect(null);
        }}
      ></CrossIcon>
    </ContainerBackButtons>
  );
};

const SectionOurServices = (props) => {
  const { width } = useWindowSize();
  const [select, setSelect] = useState(null);

  const scrollToTarget = () => {
    window.scrollTo({
        top: document?.getElementById("whatIs")?.offsetTop - 800,
        behavior: "smooth",
    });
  };

  const clickSelect = (s) => {
    setSelect(s);
    scrollToTarget();
  };

  return (
    <MySection as="section">
      <Title>Nossos serviços</Title>
      <Description>Selecione um serviço para saber mais.</Description>
      <Grid select={select}>  
        <Card
          onClick={() => {
            if (select !== 1) {
              setSelect(1);
              scrollToTarget();
            }
          }}
          className={select === 1 && "cardSelected"}
          visible={select === null || select === 1}
          select={select}
        >
          <CardContainer>
            <SectionBackButtons
              select={select}
              clickSelect={clickSelect}
            ></SectionBackButtons>
            <Image draggable={false} src={house} alt="serviço para sua casa" />
            <TitleCard>Serviços para sua casa</TitleCard>
            <DescriptionCard>
              Temos diversas soluções para manutenção, decoração e limpeza da
              sua casa.
            </DescriptionCard>
          </CardContainer>
        </Card>
        <Card
          onClick={() => {
            if (select !== 2) {
              setSelect(2);
              scrollToTarget();
            }
          }}
          className={select === 2 && "cardSelected"}
          visible={select === null || select === 2}
          select={select}
        >
          <CardContainer>
            <SectionBackButtons
              select={select}
              clickSelect={clickSelect}
            ></SectionBackButtons>
            <Image
              draggable={false}
              src={family}
              alt="serviço para sua familia"
            />
            <TitleCard>Serviços para sua família</TitleCard>
            <DescriptionCard>
              Diversos tipos de cuidados para toda a sua família, incluindo os
              seus pets!
            </DescriptionCard>
          </CardContainer>
        </Card>
        <Card
          onClick={() => {
            if (select !== 3) {
              setSelect(3);
              scrollToTarget();
            }
          }}
          className={select === 3 && "cardSelected"}
          visible={select === null || select === 3}
          select={select}
        >
          <CardContainer>
            <SectionBackButtons
              select={select}
              clickSelect={clickSelect}
            ></SectionBackButtons>
            <Image draggable={false} src={forYou} alt="serviço para você" />
            <TitleCard>Serviços para você</TitleCard>
            <DescriptionCard>
              Os mais variados cuidados pessoais para garantir o seu bem estar.
            </DescriptionCard>
          </CardContainer>
        </Card>
      </Grid>
      {width > 768 && select !== null && (
        <Box marginTop={"5rem"} height={"100%"} maxWidth="1200px" width="100%">
          {select === 1 ? (
            <MenuHome
              select={select}
              imgHeader={house}
              categories={props.categories[0]}
            />
          ) : select === 2 ? (
            <MenuHome
              select={select}
              imgHeader={family}
              categories={props.categories[1]}
            />
          ) : select === 3 ? (
            <MenuHome
              select={select}
              imgHeader={forYou}
              categories={props.categories[2]}
            />
          ) : (
            <Box></Box>
          )}
        </Box>
      )}
      {width <= 768 && select !== null && (
        <ModalOurServicesMobile
          imgHeader={select === 1 ? house : select === 2 ? family : forYou}
          isOpen={select !== null}
          categories={props.categories[select - 1]}
          onClose={() => setSelect(null)}
        />
      )}
    </MySection>
  );
};

export default SectionOurServices;

const MySection = styled(Box)`
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  padding: 100px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    padding: 50px 0rem;
  }
  @media (max-width: ${(props) => props.theme.queries.md}) {
    padding: 50px 1rem;
  }
`;

const Title = styled.h2`
  margin: 0 0 8px 0;
  font-size: 1.75rem;
  line-height: 2.125rem;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    margin: 0 0 18px 0;
  }
`;

const Description = styled(Text)`
  margin: 0;
  max-width: 720px;
  text-align: center;
  font-size: 1.125rem;
  line-height: 1 0.5625rem;
`;

const fadeIn = keyframes`
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
`;

const Grid = styled(Box)`
    margin-top: 76px;
    display: grid;
    width: 100%;
    /* grid-template-columns: repeat(3, 1fr); */
    grid-gap: 50px;
    @media (max-width: ${(props) => props.theme.queries.lg}) {
        grid-gap: 20px;
    }
    /* @media (max-width: ${(props) => props.theme.queries.md}) {
        grid-template-columns: repeat(2, 1fr);
    }
    @media (max-width: ${(props) => props.theme.queries.sm}) {
        grid-template-columns: 1fr;
    } */
    transition:0.5;
    grid-template-columns: ${(props) =>
      props.select === null ? "repeat(auto-fill, minmax(305px, 1fr))" : "1fr"} ;
    grid-auto-rows: max-content;

    .cardSelected {
        background: ${(props) =>
          props.select === null ? "#fafafa" : "transparent"};
        box-shadow: ${(props) =>
          props.select === null
            ? "inset 0px 0px 10px rgba(0, 0, 0, 0.16);"
            : "none"};
        > div{
          background: ${(props) =>
            props.select !== null ? "#fafafa" : "transparent"};
          box-shadow:  ${(props) =>
            props.select !== null
              ? "inset 0px 0px 10px rgba(0, 0, 0, 0.16);"
              : "none"};
        }
    }
`;

const Card = styled(Box)`
    display: ${(props) => (props.visible ? "flex" : "none")};
    flex-direction: column;
    align-items: center;
    width: calc(100% - .5rem);
    cursor: pointer;
    min-height: 315px;
    box-shadow: ${(props) =>
      props.select === null ? "0px 0px 10px rgba(0, 0, 0, 0.25)" : "none"};
    p {
        max-width: 300px;
        text-align: center;
    }
    &:hover {
        background: ${(props) =>
          props.select === null ? "#fafafa" : "transparent"};
        box-shadow:  ${(props) =>
          props.select === null ? "0px 0px 20px rgba(0, 0, 0, 0.26)" : "none"};
    }
    /* @media (max-width: ${(props) => props.theme.queries.lg}) {
        width: 204px;
    }
    @media (max-width: ${(props) => props.theme.queries.md}) {
        width: 254px !important;
    } */
    /* @media (max-width: ${(props) => props.theme.queries.sm}) {
        padding: 20px 0px 30px 0px;
    } */
    animation: .5s ${fadeIn} ease-in;
    div.back-buttons {
      visibility: ${(props) => (props.select !== null ? "visible" : "hidden")};
      height: ${(props) => (props.select !== null ? "auto" : "0")};
      width: calc(100% - 15px);
    }
    > div{
      box-shadow: ${(props) =>
        props.select !== null ? "0px 0px 10px rgba(0, 0, 0, 0.25)" : "none"};
      
      &:hover {
          background: #fafafa;
          box-shadow:  ${(props) =>
            props.select !== null
              ? "0px 0px 20px rgba(0, 0, 0, 0.26)"
              : "none"};
      }
    }
`;

const ContainerBackButtons = styled.div`
  display: flex;
  flex-direction: row;
  z-index: 10;
  > img {
    margin: 2.5px;
    padding: 5px;
    width: 55px;
    height: auto;
    box-shadow: none;
    background: transparent;
    &:hover {
      background: #fafafa;
      box-shadow: 0px 0px 20px rgba(0, 0, 0, 0.26);
    }
  }
  svg {
    margin-left: auto;
    margin-right: 15px;
  }
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px 0px 30px 0px;
  transition: 0.75s;
  width: 100%;
  min-height: 315px;
`;

const TitleCard = styled(Text)`
  font-size: 1.5rem;
  line-height: 1.8125rem;
  text-align: center;
  color: ${(props) => props.theme.color.darkBlue};
`;

const DescriptionCard = styled(Text)`
  font-size: 1.125rem;
  line-height: 1.5625rem;
  text-align: center;
  color: #333333;
  width: 220px;
`;
