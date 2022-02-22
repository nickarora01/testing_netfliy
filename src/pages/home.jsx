import React, { useEffect } from "react";
import styled from "styled-components";
import { Box } from "@chakra-ui/react";
import { useStore, useActions } from "../configureStore";

import SectionWhatsIsHomeAssist from "../components/Home/SectionWhatIsHomeAssist";
import SectionFindSolution from "../components/Home/SectionFindSolution";
import SectionBeAssistant from "../components/Home/SectionBeAssistant";
import SectionOurServices from "../components/Home/SectionOurServices";

const Home = () => {
  const categories = useStore((state) => state.categories.categoriesList);
  const listCategories = useActions((action) => action.categories.list);

  useEffect(() => {
    listCategories();
  }, []);

  return (
    <Container>
      <Box backgroundColor={"white"}>
        <SectionOurServices categories={categories} />
      </Box>
      <SectionWhatsIsHomeAssist />
      {/* <SectionBenefits /> */}
      <SectionBeAssistant />
      <SectionFindSolution />
    </Container>
  );
};

export default Home;

const Container = styled.div`
  background-color: ${(props) => props.theme.color.lightGray};
`;
