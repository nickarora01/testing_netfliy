import React from "react";
import styled from "styled-components";
import { Box, Image, Icon, Skeleton, Tag, Flex } from "@chakra-ui/react";
import useWindowSize from "../../hooks/useWIndowSize";
import verifiedIcon from "../../assets/icons/verified.svg";

import noUser from "../../assets/icons/nouser.svg";

const CardSkeleton = (props) => {
  return (
    <Container onClick={props.handleCard} tabIndex={0}>
      <ImageSkeleton />
      <NameSkeleton />
      <DescriptionSkeleton />
      {props.isAuth && <ValueSkeleton />}
    </Container>
  );
};

const CardProfessional = (props) => {
  const { width } = useWindowSize();

  return (
    <>
      {props.loading ? (
        <CardSkeleton />
      ) : (
        <Container onClick={props.handleCard} tabIndex={0}>
          <BoxImage position="relative">
            <CustomImage
              draggable={false}
              src={
                props.image?.length > 0
                  ? `${process.env.REACT_APP_ASSETS_BUCKET}/users/${props.image}`
                  : noUser
              }
            />
            {props.verified && (
              <ImgVerified alt={"Acurado"} src={verifiedIcon} />
            )}
            {props.super && <SuperBadge>super profissional</SuperBadge>}
          </BoxImage>
          <Value>
            {!props.isAuth
              ? props.name?.split(" ")[0]
              : props.user.user_premium
              ? props.name
              : props.name?.split(" ")[0]}
          </Value>
          {props.profession?.length > 2 ? (
            <Flex flexWrap={"wrap"}>
              {props.profession?.slice(0, 2)?.map((item, idx) => (
                <CustomTag key={idx}>
                  {width <= 440
                    ? `${item?.name?.substring(0, 20)}...`
                    : item?.name}
                </CustomTag>
              ))}
              <CustomTag>Outros</CustomTag>
            </Flex>
          ) : (
            <Flex flexWrap={"wrap"}>
              {props.profession?.map((item, idx) => (
                <CustomTag key={idx}>
                  {width <= 440
                    ? `${item?.name?.substring(0, 20)}...`
                    : item?.name}
                </CustomTag>
              ))}
            </Flex>
          )}
          {props.value && props.isAuth && <Value>{props.value}</Value>}
        </Container>
      )}
    </>
  );
};

export default CardProfessional;

const Container = styled(Box)`
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  :hover,
  :focus {
    opacity: 0.8;
    outline: none;
  }
`;

const BoxImage = styled(Box)`
  height: 185px;
  margin-bottom: 1rem;
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    height: 140px;
  }
`;

const CustomImage = styled(Image)`
  min-width: 170px;
  max-height: 175px;
  max-width: 220px;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    min-width: 130px;
    max-width: 130px;
  }
`;

const SuperBadge = styled(Box)`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 25px;
  text-align: center;
  background-color: #f3f3f6;
  border-radius: 0.3rem;
  font-size: 0.8rem;
  background-color: rgba(255, 255, 255, 0.95);
  border: 0.5px solid rgba(0, 0, 0, 0.2);
  top: -192px;
  left: 0px;
  text-transform: uppercase;
  font-weight: 600;
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    top: -155px;
    font-size: 0.7rem;
    padding: 0 0.5rem;
  }
  @media (max-width: ${(props) => props.theme.queries.i5}) {
    font-size: 0.6rem;
  }
`;

const Description = styled(Box)`
  font-size: 1rem;
  margin: 0.5rem 0;
`;

const Value = styled(Box)`
  font-weight: 700;
  font-size: 1.2rem;
  color: #333;
`;

//Skeleton

const ImageSkeleton = styled(Skeleton)`
  height: 195px;
  width: 100%;
`;

const DescriptionSkeleton = styled(Skeleton)`
  height: 72px;
  margin: 1rem 0;
  width: 100%;
`;

const ValueSkeleton = styled(Skeleton)`
  height: 40px;
  width: 50%;
`;

const NameSkeleton = styled(Skeleton)`
  margin-top: 1rem;
  height: 40px;
  width: 100%;
`;

const CustomTag = styled(Tag)`
  font-size: 0.9rem;
  padding: 0 0.5rem !important;
  margin: 0.3rem 0.3rem 0.3rem 0;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    font-size: 0.8rem;
  }
`;

const ImgVerified = styled.img`
  position: absolute;
  left: 5px;
  top: 5px;
  width: 32px;
`;
