import React from "react";
import styled from "styled-components";
import { Box, Icon, Image, Skeleton } from "@chakra-ui/react";

import heart from "../../assets/icons/heart.svg";
import heartCheck from "../../assets/icons/heart-check.svg";
import star from "../../assets/icons/star.svg";
import medal from "../../assets/icons/medal.svg";

const Header = (props) => {
  return (
    <ContainerHeader>
      {props.district?.length > 0 ? (
        <HeaderRow flexWrap="wrap">
          <ItemHeader cursor="default">
            <Image src={star} marginBottom=".1rem" />
            {/* <span>- ( - ) ·</span> */}
            <span>-</span>
          </ItemHeader>
          {/* <ItemHeader cursor="default">
              <Image src={medal} marginBottom=".1rem" />
              <span>Super Profissional ·</span>
            </ItemHeader> */}
          <Locale>{`${props.district}, ${props.city}, ${props.country}`}</Locale>
        </HeaderRow>
      ) : (
        <MySkeleton />
      )}
      <HeaderRow>
        {/* <LinkAction onClick={props.handleShare}>
          <Icon name="external-link" size="16px" marginRight=".5rem" />
          <span>Compartilhar</span>
        </LinkAction> */}
        {/* <LinkAction onClick={props.handleSave}>
          <Image src={props.check ? heartCheck : heart} />
          <span>{props.check ? "Salvo" : "Salvar"}</span>
        </LinkAction> */}
      </HeaderRow>
    </ContainerHeader>
  );
};

export default Header;

const ContainerHeader = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderRow = styled(Box)`
  display: flex;
  align-items: center;

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin-bottom: 0.5rem;
    align-items: flex-end;
  }
`;

//LEFT

const Locale = styled(Box)`
  cursor: default;
  text-decoration: underline;
  color: #717171;
  font-weight: 600;
  transition: 0.3s;

  @media (max-width: ${(props) => props.theme.queries.md}) {
    font-size: 14px;
  }

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin-top: 0.5rem;
  }
`;

const ItemHeader = styled(Box)`
  display: flex;
  align-items: center;
  margin-right: 0.5rem;

  img {
    width: 16px;
    height: 16px;
    margin-right: 0.3rem;
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    font-size: 14px;
  }
`;

//RIGHT

const LinkAction = styled(Box)`
  display: flex;
  align-items: center;
  border-radius: 0.3rem;
  cursor: pointer;
  padding: 0.3rem 0.7rem;
  transition: 0.3s;

  img {
    width: 16px;
    height: 16px;
    margin-right: 0.5rem;
  }

  span {
    text-decoration: underline;
    font-weight: 600;
  }

  :hover,
  :focus {
    background-color: #eee;
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    span {
      font-size: 14px;
    }
  }

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    display: none;
  }
`;

const MySkeleton = styled(Skeleton)`
  height: 20px;
  width: 200px;
`;
