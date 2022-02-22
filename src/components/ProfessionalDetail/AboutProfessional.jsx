import React from "react";
import styled from "styled-components";
import { Box, Text, Skeleton } from "@chakra-ui/react";
import { HomeIcon, LearningIcon, TimeIcon } from "evergreen-ui";
import FacebookIcon from "../../assets/icons/facebook-logo.svg";
import InstagramIcon from "../../assets/icons/instagram-logo.svg";
import LinkedinIcon from "../../assets/icons/linkedin-logo.svg";
import TwitterIcon from "../../assets/icons/twitter-logo.svg";
import VerifiedIcon from "../../assets/icons/verified.svg";

const SkillItem = (props) => {
  return (
    <BoxItem className="box-item">
      {props.link && <Image src={props.icon} />}
      {props.icon === "home" && <Homeico />}
      {props.icon === "learning" && <Learningicon />}
      {props.icon === "time" && <Timeicon />}
      {props.icon === "verified" && <ImageIcon src={VerifiedIcon} />}
      <Title>{props.title}</Title>
      {props.link ? (
        <Link href={props.description} target="_blank">
          <Description>{props.description}</Description>
        </Link>
      ) : (
        <Description>{props.description}</Description>
      )}
    </BoxItem>
  );
};

const ProfessionalSkills = (props) => {
  return (
    <>
      <Container id="aboutUser">
        {props.data?.verified && (
          <SkillItem icon="verified" title={"Acurado"} description="" />
        )}

        {props.data?.region_work?.length > 0 && (
          <SkillItem
            icon="home"
            title={props.data?.region_work}
            description=""
          />
        )}

        {props.data?.courses?.length > 0 ? (
          <SkillItem
            icon="learning"
            title={props.data?.courses}
            description=""
          />
        ) : (
          props.data?.type === 2 && (
            <MySkeleton marginTop="30px" height="50px" />
          )
        )}

        {props.data?.time_experience?.length > 0 ? (
          <SkillItem
            icon="time"
            title={`${props.data?.time_experience} de experiência`}
            description=""
          />
        ) : (
          props.data?.type === 2 && (
            <MySkeleton marginTop="30px" height="50px" />
          )
        )}
        {props.data?.has_social_link && props.data?.hidden === false && (
          <>
            {props.data?.facebook_link && (
              <SkillItem
                icon={FacebookIcon}
                title={`Facebook`}
                link={true}
                description={props.data?.facebook_link}
              />
            )}
            {props.data?.instagram_link && (
              <SkillItem
                icon={InstagramIcon}
                title={`Instagram`}
                link={true}
                description={props.data?.instagram_link}
              />
            )}
            {props.data?.linkedin_link && (
              <SkillItem
                icon={LinkedinIcon}
                title={`Linkedin`}
                link={true}
                description={props.data?.linkedin_link}
              />
            )}
            {props.data?.twitter_link && (
              <SkillItem
                icon={TwitterIcon}
                title={`Twitter`}
                link={true}
                description={props.data?.twitter_link}
              />
            )}
          </>
        )}
      </Container>
    </>
  );
};

export default ProfessionalSkills;

const Container = styled(Box)`
  cursor: default;
  padding: 1rem 0;
  display: flex;
  flex-direction: column;

  .box-item {
    padding: 1rem 0;
  }
`;

//ITEM

const BoxItem = styled(Box)`
  cursor: default;
  display: grid;
  grid-template-areas:
    "icone title"
    "any description";
  grid-template-columns: 30px 1fr;
  grid-gap: 5px 20px;
  align-items: center;
  padding: 0.5rem 0 !important;

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    align-items: flex-start;
  }
`;

const Homeico = styled(HomeIcon)`
  grid-area: icone;
  padding-top: 0.5rem;
  width: 35px;
  height: 30px;
`;

const Learningicon = styled(LearningIcon)`
  grid-area: icone;
  padding-top: 0.5rem;
  width: 35px;
  height: 30px;
`;

const Timeicon = styled(TimeIcon)`
  grid-area: icone;
  padding-top: 0.5rem;
  width: 35px;
  height: 30px;
`;

const Title = styled.span`
  grid-area: title;
  margin-top: 10px;
  font-size: 1.1rem;
  font-weight: 600;

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    font-size: 0.99rem;
  }
`;

const Description = styled(Text)`
  grid-area: description;
  margin: 0;
  color: ${(props) => props.theme.color.grayText};
  font-size: 1rem;

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    font-size: 0.9rem;
  }
`;

//loading skeleton

const MySkeleton = styled(Skeleton)`
  width: 80%;
`;

const Link = styled.a`
  display: flex;
  text-decoration: none;
`;

const Image = styled.img`
  grid-area: icone;
  padding-top: 0.5rem;
  width: 35px;
  height: 30px;
  color: #525f7f;
`;

const ImageIcon = styled.img`
  grid-area: icone;
  padding-top: 0.5rem;
  width: 32px;
  height: 32px;
  color: #525f7f;
`;
