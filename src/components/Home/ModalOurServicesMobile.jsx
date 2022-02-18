import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Box,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Icon,
} from "@chakra-ui/react";
import { useHistory } from "react-router-dom";

//assets
import imageArrow from "../../assets/icons/home/arrow-menu-black.svg";

const ModalOurServicesMobile = (props) => {
  const history = useHistory();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  //state breadcumps
  const [breadItem, setBreadItem] = useState(null);
  const [breadItem2, setBreadItem2] = useState(null);

  useEffect(() => {
    setCategories([]);
    setSubcategories([]);
  }, [props.select]);

  return (
    <Drawer onClose={props.onClose} isOpen={props.isOpen} size={"full"}>
      <DrawerOverlay />
      <DrawerContent left={0} height="auto !important">
        <DrawerCloseButton />
        <DrawerHeader>
          <img src={props.imgHeader} alt="" width="40px" height="38px" />
        </DrawerHeader>
        <DrawerBody paddingRight="1rem" paddingLeft="1rem" overflowY="auto">
          <CustomBreadcrumb
            margin={0}
            padding={0}
            spacing="8px"
            separator={<Icon color="gray.300" name="chevron-right" />}
          >
            {breadItem !== null && breadItem?.length > 0 && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  as="span"
                  onClick={() => {
                    setCategories([]);
                    setSubcategories([]);
                    setBreadItem2(null);
                    setBreadItem(null);
                  }}
                >
                  Categorias
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {breadItem !== null && breadItem?.length > 0 && (
              <BreadcrumbItem>
                <BreadcrumbLink
                  as="span"
                  onClick={() => {
                    setSubcategories([]);
                    setBreadItem2(null);
                  }}
                >
                  {breadItem}
                </BreadcrumbLink>
              </BreadcrumbItem>
            )}

            {breadItem2 !== null && breadItem2?.length > 0 && (
              <BreadcrumbItem>
                <BreadcrumbLink as="span">{breadItem2}</BreadcrumbLink>
              </BreadcrumbItem>
            )}
          </CustomBreadcrumb>
          {subcategories?.length > 0 && (
            <MyList as="ul">
              {subcategories?.map((item, idx) => {
                return (
                  <ListItem
                    as="li"
                    key={idx}
                    onClick={() => {
                      history.push(
                        `/profissionais?start=0&categories=${item?.id}&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=`
                      );
                      window.scrollTo(0, 0);
                    }}
                  >
                    <span>{item?.label}</span>
                    <ImageArrow src={imageArrow} />
                  </ListItem>
                );
              })}
            </MyList>
          )}
          {categories?.length > 0 && (
            <MyList as="ul">
              {categories?.map((item, idx) => {
                return (
                  <ListItem
                    as="li"
                    key={idx}
                    onClick={() => {
                      if (item?.nodes?.length > 0) {
                        setSubcategories(item?.nodes);
                        setBreadItem2(item?.label);
                      } else {
                        history.push(
                          `/profissionais?start=0&categories=${item?.id}&price_min=&price_max=&language=&city=&country=&pageNumber=0&gender=&text=&distance=`
                        );
                        window.scrollTo(0, 0);
                      }
                    }}
                  >
                    <span>{item?.label}</span>
                    <ImageArrow src={imageArrow} />
                  </ListItem>
                );
              })}
            </MyList>
          )}
          {categories?.length === 0 && subcategories?.length === 0 && (
            <MyList as="ul">
              {props.categories?.hasOwnProperty("id") &&
                props.categories?.nodes?.map((item, idx) => {
                  return (
                    <ListItem
                      as="li"
                      key={idx}
                      onClick={() => {
                        setCategories(item?.nodes);
                        setBreadItem(item?.label);
                      }}
                    >
                      <span>{item?.label}</span>
                      <ImageArrow src={imageArrow} />
                    </ListItem>
                  );
                })}
            </MyList>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default ModalOurServicesMobile;

const MyList = styled(Box)`
  padding: 0;
  margin: 0;
  height: 100vh;
`;

const ListItem = styled(Box)`
  height: 55px;
  list-style: none;
  border-bottom: 1px solid #eee;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ImageArrow = styled.img`
  margin-right: 8px;
  width: 8px;
  height: 10px;
`;

const CustomBreadcrumb = styled(Breadcrumb)`
  ol {
    padding: 0 !important;
  }
`;
