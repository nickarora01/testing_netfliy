import React, { useEffect, useState } from "react";
import { Box } from "@chakra-ui/react";
import styled from "styled-components";
import { withRouter } from "react-router-dom";
import { useActions, useStore } from "../../configureStore";
import useGeolocation from "../../hooks/useGeolocation";

import imageArrow from "../../assets/icons/home/arrow-menu.svg";

const MenuHome = (props) => {
  const geolocation = useGeolocation();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [subNivel, setSubNivel] = useState([]);

  const [selectCategory, setSelectCategory] = useState({});
  const [selectSubcategory, setSelectSubcategory] = useState({});
  const [selectSubNivel, setSelectSubNivel] = useState({});
  const [selectedService, setSelectedService] = useState(props.categories.name);
  const [breadcrumb, setBreadcrumb] = useState([]);

  useEffect(() => {
    setCategories(props.categories?.nodes[0]?.nodes);
    setSelectCategory(props.categories.nodes[0]);
    setSubcategories([]);
  }, [props.select]);

  useEffect(() => {
    setSelectedService(props.categories.name);
    setBreadcrumb([selectedService]);
  }, [props.categories]);

  const handlerCategory = (item) => {
    setCategories(item?.nodes);
    setSelectCategory(item);

    setSubcategories({});
    setSelectSubcategory({});

    setSubNivel({});
    setSelectSubNivel({});
  };

  const handlerSubCategory = (item) => {
    setSubcategories(item?.nodes);
    setSelectSubcategory(item);

    setSubNivel({});
    setSelectSubNivel({});
  };

  const handlerSubNivel = (item) => {
    setSubNivel(item?.nodes);
    setSelectSubNivel(item);
  };

  return (
    <Wrapper>
      <ColumnMenu>
        <HeaderMenu>
          <img src={props.imgHeader} alt="" width="40px" height="38px" />
        </HeaderMenu>
        <List>
          {props.categories?.hasOwnProperty("id") &&
            props.categories?.nodes?.map((item, idx) => {
              return (
                <Wrap key={idx}>
                  <ListItem
                    className={
                      item?.id === selectCategory?.id ? "active" : "unactive"
                    }
                    key={idx}
                    onClick={() => {
                      props.history.push(
                        `/profissionais?start=0&categories=${
                          item?.id
                        }&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=${
                          geolocation?.latitude && 100
                        }&lat=${geolocation?.latitude}&lng=${
                          geolocation?.longitude
                        }&breadcrumb=${breadcrumb}`
                      );
                    }}
                    onMouseEnter={() => {
                      handlerCategory(item);
                      setBreadcrumb([selectedService, item?.name]);
                    }}
                  >
                    <span>{item?.label}</span>
                    <ImageArrow src={imageArrow} />
                  </ListItem>
                </Wrap>
              );
            })}
        </List>
      </ColumnMenu>
      <GridContent>
        <Box as="ul" padding={"5px 10px"}>
          {categories?.length > 0 &&
            categories?.map((item, idx) => {
              return (
                <Wrap key={idx}>
                  <ListItem
                    className={
                      item?.id === selectSubcategory?.id ? "active" : "unactive"
                    }
                    key={idx}
                    onClick={() => {
                      props.history.push(
                        `/profissionais?start=0&categories=${item?.id}&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=&lat=${geolocation?.latitude}&lng=${geolocation?.longitude}&breadcrumb=${breadcrumb}`
                      );
                    }}
                    onMouseEnter={() => {
                      handlerSubCategory(item);
                      setBreadcrumb([
                        selectedService,
                        selectCategory.name,
                        item?.name,
                      ]);
                    }}
                  >
                    <span>{item?.label}</span>
                    <ImageArrow src={imageArrow} />
                  </ListItem>
                </Wrap>
              );
            })}
        </Box>

        <Box as="ul" padding={"5px 10px"}>
          {subcategories?.length > 0 &&
            subcategories?.map((item, idx) => {
              return (
                <Wrap key={idx}>
                  <ListItem
                    className={
                      item?.id === selectSubNivel?.id ? "active" : "unactive"
                    }
                    key={idx}
                    onClick={() => {
                      props.history.push(
                        `/profissionais?start=0&categories=${item?.id}&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=&lat=${geolocation?.latitude}&lng=${geolocation?.longitude}&breadcrumb=${breadcrumb}`
                      );
                    }}
                    onMouseEnter={() => {
                      handlerSubNivel(item);
                      setBreadcrumb([
                        selectedService,
                        selectCategory.name,
                        selectSubcategory.name,
                        item?.name,
                      ]);
                    }}
                  >
                    <span>{item?.label}</span>
                    <ImageArrow src={imageArrow} />
                  </ListItem>
                </Wrap>
              );
            })}
        </Box>

        <Box as="ul" padding={"5px 10px"}>
          {subNivel?.length > 0 &&
            subNivel?.map((item, idx) => {
              return (
                <Box key={idx}>
                  <ListItem
                    key={idx}
                    onClick={() => {
                      props.history.push(
                        `/profissionais?start=0&categories=${item?.id}&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=&lat=${geolocation?.latitude}&lng=${geolocation?.longitude}`
                      );
                      window.scrollTo(0, 0);
                    }}
                  >
                    <span>{item?.label}</span>
                    <ImageArrow src={imageArrow} />
                  </ListItem>
                </Box>
              );
            })}
        </Box>
      </GridContent>
    </Wrapper>
  );
};

export default withRouter(MenuHome);

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 30% 70%;
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.16);
  @media (max-width: ${(props) => props.theme.queries.lg}) {
    margin: 0 1rem;
  }
`;

const ColumnMenu = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: auto;
  background: #f9f9f9;
`;

const HeaderMenu = styled.div`
  padding-top: 24px;
  padding-left: 27px;
`;

const Wrap = styled(Box)`
  .active {
    background-color: #8cc73d;
    color: #fff;
  }
`;

const List = styled.ul`
  list-style-type: none;
  padding-left: 0px;
`;

const ListItem = styled.li`
  transition: all 0.1s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 27px;
  height: auto;
  cursor: pointer;
  font-size: 16px;
  color: #000000;
  @media (min-width: ${(props) => props.theme.queries.lg}) {
    &:hover,
    &:focus {
      background-color: #8cc73d;
      color: #fff;
    }
  }
`;

const ImageArrow = styled.img`
  margin-right: 15px;
  width: 8px;
  height: 10px;
`;

const GridContent = styled(Box)`
  display: grid;
  grid-template-columns: 33% 33% 33%;
`;
