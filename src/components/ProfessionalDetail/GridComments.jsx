import React, { useState } from "react";
import styled from "styled-components";
import {
  Box,
  Text,
  Icon,
  Progress,
  Avatar,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";
import { theme } from "../../theme";
import useWindowSize from "../../hooks/useWIndowSize";

const RowRating = (props) => {
  return (
    <Rating>
      <Text margin={0}>{props.label}</Text>
      <Box display="flex" alignItems="center">
        <CustomProgress value={props.progress} />
        <b>{props.rating?.toFixed(1)}</b>
      </Box>
    </Rating>
  );
};

const RowRatingModal = (props) => {
  return (
    <ModalRating>
      <Text margin={0}>{props.label}</Text>
      <Box display="flex" alignItems="center">
        <CustomProgress value={props.progress} />
        <b>{props.rating?.toFixed(1)}</b>
      </Box>
    </ModalRating>
  );
};

const CommentCard = (props) => {
  return (
    <BoxComment key={props.key} {...props}>
      <CustomAvatar name={props.username} src={props.avatar} />
      <Username>{props.username}</Username>
      <Date>{props.date}</Date>
      <Description>{props.description}</Description>
    </BoxComment>
  );
};

const GridComments = (props) => {
  const { width } = useWindowSize();
  const [showComments, setShowComments] = useState(false);
  const fakeContent = [
    { name: "test1" },
    { name: "test2", children: "children 2" },
    { name: "test3" },
    { name: "test4", children: "children 4" },
    { name: "test5" },
    { name: "test6" },
  ];

  return (
    <Box cursor="default">
      <Title>
        <Icon
          name="star"
          marginBottom="5px"
          marginRight="10px"
          color={theme.color.green}
        />
        {/* <h3>4,89 (74 comentários)</h3> */}
        <h3>- (0 comentários)</h3>
      </Title>
      <Grid>
        <RowRating label="Lorem ipsum" progress={0} rating={0} />
        <RowRating label="Lorem ipsum" progress={0} rating={0} />
        <RowRating label="Lorem ipsum" progress={0} rating={0} />
        <RowRating label="Lorem ipsum" progress={0} rating={0} />
        <RowRating label="Lorem ipsum" progress={0} rating={0} />
        <RowRating label="Lorem ipsum" progress={0} rating={0} />
        {[...Array(6)].map((item, idx) => (
          <CommentCard
            key={idx}
            username="John Doe"
            date="09/07/2020"
            description=""
          />
        ))}
      </Grid>
      {[...Array(6)]?.length > 10 ? (
        <MyBtn onClick={() => setShowComments(true)}>
          Mostrar todos os comentários
        </MyBtn>
      ) : (
        <Box height="20px" />
      )}

      {/* MODAL */}

      <Modal
        onClose={() => setShowComments(false)}
        size={"780px"}
        isOpen={showComments}
        scrollBehavior={"inside"}
      >
        <ModalOverlay />
        <ModalContent maxHeight="700px">
          <ModalHeader height="40px">
            <CustomCloseModal />
          </ModalHeader>
          <ModalBody paddingTop="1rem">
            <ModalGrid>
              <Box>
                <Title>
                  <Icon
                    name="star"
                    marginBottom="5px"
                    marginRight="10px"
                    color={theme.color.green}
                  />
                  <Box as="h3" fontSize="1.1rem">
                    4,89 (74 comentários)
                  </Box>
                </Title>
                <RowRatingModal
                  label="Lorem ipsum"
                  progress={100}
                  rating={5.0}
                />
                <RowRatingModal
                  label="Lorem ipsum"
                  progress={95}
                  rating={4.5}
                />
                <RowRatingModal
                  label="Lorem ipsum"
                  progress={100}
                  rating={5.0}
                />
                <RowRatingModal
                  label="Lorem ipsum"
                  progress={50}
                  rating={2.5}
                />
                <RowRatingModal
                  label="Lorem ipsum"
                  progress={100}
                  rating={5.0}
                />
                <RowRatingModal
                  label="Lorem ipsum"
                  progress={95}
                  rating={4.5}
                />
              </Box>
              <Box padding={width <= 440 ? "0 0 2rem 0" : "2rem 0"}>
                {fakeContent.map((item, idx) => (
                  <Box key={idx}>
                    <CommentCard
                      username="John Doe"
                      date="09/07/2020"
                      description=""
                    />
                    {item?.children && (
                      <CommentCard
                        marginLeft={"3rem"}
                        key={idx}
                        username="John Doe"
                        date="09/07/2020"
                        description=""
                      />
                    )}
                  </Box>
                ))}
              </Box>
            </ModalGrid>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default GridComments;

const Title = styled(Box)`
  display: flex;
  align-items: center;
  font-size: 1.3rem;
  font-weight: 600;
  margin: 0 0 1.5rem 0;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin: 0 0 0rem 0;
  }
`;

const Grid = styled(Box)`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 0 150px;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
`;

//Row Rating

const Rating = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    display: none;
  }
`;

const CustomProgress = styled(Progress)`
  width: 125px;
  height: 5px !important;
  border-radius: 1rem;
  margin-right: 1rem;
  div {
    background-color: ${(props) => props.theme.color.green};
  }
`;

//COMMENT CARD

const BoxComment = styled(Box)`
  display: grid;
  grid-template-areas:
    "avatar username"
    "avatar date"
    "description description";
  grid-template-columns: 56px 1fr;
  grid-gap: 0 5px;
  margin-top: 3rem;
  align-items: center;
`;

const CustomAvatar = styled(Avatar)`
  grid-area: avatar;
  height: 56px;
  width: 56px;
  background-color: ${(props) => props.theme.color.green} !important;
`;

const Username = styled(Box)`
  grid-area: username;
  font-weight: 600;
`;

const Date = styled(Box)`
  grid-area: date;
  font-size: 0.8rem;
`;

const Description = styled(Text)`
  grid-area: description;
  margin: 0.5rem 0 0 0;
`;

const MyBtn = styled(Button)`
  cursor: pointer;
  font-weight: 500 !important;
  color: #222;
  background-color: transparent !important;
  border: 1px solid #222 !important;
  border-radius: 0.5rem !important;
  width: 25% !important;
  height: 48px !important;
  font-size: 1.1rem !important;
  margin-top: 2rem;
  margin-bottom: 2rem;
  :hover,
  :focus {
    opacity: 0.7;
  }

  @media (max-width: ${(props) => props.theme.queries.md}) {
    width: 40% !important;
  }

  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 100% !important;
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

const ModalGrid = styled(Box)`
  display: grid;
  grid-template-columns: 0.8fr 1fr;
  grid-gap: 0 90px;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
`;

const ModalRating = styled(Rating)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    display: flex !important;
  }
`;
