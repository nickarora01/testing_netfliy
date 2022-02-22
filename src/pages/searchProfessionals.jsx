import React, { useEffect, useState } from "react";
import styled from "styled-components";
import {
  Box,
  Divider,
  Heading,
  Button,
  IconButton,
  Text,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import { Popover } from "evergreen-ui";
import { SearchIcon, ChevronRightIcon } from "@chakra-ui/icons";
import ReactPaginate from "react-paginate";
import queryString from "query-string";
import { useStore, useActions } from "../configureStore";
import useWindowSize from "../hooks/useWIndowSize";
import { theme } from "../theme";

//components
import Tag from "../components/SearchProfessionals/Tag";
import CardProfessional from "../components/SearchProfessionals/CardProfessional";
import ModalMoreFilters from "../components/SearchProfessionals/ModalMoreFilters";
import PriceMinMax from "../components/SearchProfessionals/Modals/PriceMinMax";
import CategoryModal from "../components/SearchProfessionals/Modals/CategoryModal";
import DistanceModal from "../components/SearchProfessionals/Modals/DistanceModal";
import { toaster } from "evergreen-ui";

const SearchProfessionals = (props) => {
  //hooks
  const { width } = useWindowSize();

  //querystring
  const query = queryString.parse(props.location.search);
  const queryOffset = parseInt(query.start) || "";
  const queryPageNumber = parseInt(query.pageNumber) || "";
  const queryCategories = query.categories || "";
  const queryPriceMin = parseInt(query.price_min) || "";
  const queryPriceMax = parseInt(query.price_max) || "";
  const queryLanguage = query.language || "";
  const queryGender = query.gender || "";
  const queryText = query.text || "";
  const queryCountry = query.country || "";
  const queryState = query.state || "";
  const queryDistance = parseFloat(query.distance) || "";
  const queryLat = parseFloat(query.lat) || "";
  const queryLng = parseFloat(query.lng) || "";
  const queryHomeAssistant =
    query.home_assistent === "false"
      ? false
      : query.home_assistent === "true"
      ? true
      : "";
  const queryBreadcrumb = query.breadcrumb || "";

  //state
  const [showMoreFilters, setShowMoreFiltets] = useState(false);
  const isAuth = useStore((state) => state.auth.isAuthenticated);
  const loading = useStore((state) => state.professional.isLoading);
  const count = useStore((state) => state.professional.ct);
  const professionals = useStore((state) => state.professional.professionals);
  const [offset, setOffset] = useState(parseInt(queryOffset) || 0);
  const [pageNumber, setPageNumber] = useState(parseInt(queryPageNumber) || 0);
  const [text, setText] = useState(queryText || "");
  const user = useStore((state) => state.user.user);

  //actions
  const list = useActions((action) => action.professional.listProfessionals);
  const setLoading = useActions((action) => action.categories.setLoading);

  const handlePageClick = (selected) => {
    const offset = Math.ceil(selected * 20);
    const pageNumber = offset / 20;

    setOffset(offset);
    setPageNumber(pageNumber);
  };

  useEffect(() => {
    list(
      `start=${offset}&categories=${queryCategories}&price_min=${
        queryPriceMin || ""
      }&price_max=${
        queryPriceMax || ""
      }&language=${queryLanguage}&state=${queryState}&country=${queryCountry}&gender=${queryGender}&text=${queryText}&distance=${
        queryDistance || ""
      }&home_assistent=${
        queryHomeAssistant || false
      }&lat=${queryLat}&lng=${queryLng}&breadcrumb=${queryBreadcrumb}`
    );

    props.history.replace({
      pathname: "/profissionais",
      search: `?start=${offset}&categories=${queryCategories}&price_min=${queryPriceMin}&price_max=${queryPriceMax}&language=${queryLanguage}&state=${queryState}&country=${queryCountry}&pageNumber=${pageNumber}&gender=${queryGender}&text=${queryText}&distance=${
        queryDistance || ""
      }&home_assistent=${
        queryHomeAssistant || false
      }&lat=${queryLat}&lng=${queryLng}&breadcrumb=${queryBreadcrumb}`,
      state: { some: "state" },
    });
  }, [
    offset,
    queryCategories,
    queryLanguage,
    pageNumber,
    queryPriceMin,
    queryPriceMax,
    queryGender,
    queryText,
    queryDistance,
    queryHomeAssistant,
    queryLat,
    queryLng,
    queryBreadcrumb,
  ]);

  return (
    <Container>
      <Box cursor="default">
        <Flex
          justifyContent={"space-between"}
          alignItems={["flex-end", "flex-end", "center", "center"]}
          flexDirection={["column", "column", "row", "row"]}
        >
          <Title as="h1">Profissionais perto de você</Title>
          <Button
            size="md"
            color="#fff"
            cursor="pointer"
            border="none"
            backgroundColor={theme.color.green}
            onClick={() => {
              setLoading({ loading: true });
              props.history.replace({
                pathname: "/profissionais",
                search: `?categories=&price_min=&price_max=&language=&state=&country=&pageNumber=0&gender=&text=&distance=&home_assistant=`,
                state: { some: "state" },
              });
              setOffset(0);
              setPageNumber(0);
            }}
            icon="repeat"
          >
            Voltar
          </Button>
        </Flex>
        {
          // Separa o array de strings e mapeia adicionando o ícone depois dos items
          queryBreadcrumb.split(",").map((item, idx) => (
            <span key={idx}>
              {item}
              {idx !== queryBreadcrumb.split(",").length - 1 && (
                <ChevronRightIcon />
              )}
            </span>
          ))
        }
      </Box>
      {isAuth && (
        <InputGroup
          width={width <= 440 ? "100%" : "32%"}
          size="md"
          marginY={["2.5rem", "2.5rem", "3rem", "3rem"]}
        >
          <Input
            pr="4.5rem"
            placeholder="Pesquisar por nome..."
            value={text}
            borderColor="#b0b0b0"
            onKeyUp={(e) => {
              if (e.keyCode === 13) {
                props.history.replace({
                  pathname: "/profissionais",
                  search: `?start=0&categories=&price_min=&price_max=&language=&state=&country=&pageNumber=${queryPageNumber}&gender=&text=${text}&distance=&home_assistant=`,
                  state: { some: "state" },
                });
              }
            }}
            onChange={(e) => {
              setText(e.target.value);
            }}
          />
          <InputRightElement width="2.8rem" paddingTop="2px">
            <IconButton
              size="sm"
              color="#fff"
              cursor="pointer"
              border="none"
              backgroundColor={theme.color.green}
              onClick={() => {
                props.history.replace({
                  pathname: "/profissionais",
                  search: `?start=0&categories=&price_min=&price_max=&language=&state=&country=&pageNumber=${queryPageNumber}&gender=&text=${text}&distance=&home_assistant=`,
                  state: { some: "state" },
                });
              }}
              icon={<SearchIcon />}
            />
          </InputRightElement>
        </InputGroup>
      )}
      <ContainerFilters>
        {/* <AddressModal>
          <Tag show={width <= 440 ? "none" : "block"} label="Endereço" />
        </AddressModal> */}

        <DistanceModal>
          <div>
            <Tag show={width <= 440 ? "none" : "block"} label="Distância" />
          </div>
        </DistanceModal>

        <CategoryModal>
          <div>
            <Tag show={width <= 440 ? "none" : "block"} label="Profissão" />
          </div>
        </CategoryModal>

        {isAuth && (
          <PriceMinMax>
            <div>
              <Tag show={width <= 440 ? "none" : "block"} label="Preço" />
            </div>
          </PriceMinMax>
        )}

        <Tag
          width={width <= 440 ? "7rem !important" : "auto"}
          label={width <= 440 ? "Filtros" : "Mais Filtros"}
          onClick={() => setShowMoreFiltets(true)}
        />
      </ContainerFilters>
      {!loading && (
        <ModalMoreFilters
          onClose={() => setShowMoreFiltets(false)}
          isOpen={showMoreFilters}
          setOffset={setOffset}
          setPageNumber={setPageNumber}
          categories={queryCategories.split(",")}
        />
      )}
      {loading ? (
        <GridCards>
          {[...Array(20)]?.map((item, idx) => (
            <CardProfessional loading={loading} key={idx} />
          ))}
        </GridCards>
      ) : (
        <>
          {professionals?.length > 0 ? (
            <GridCards>
              {professionals?.map((item, idx) => (
                <CardProfessional
                  isAuth={isAuth}
                  loading={loading}
                  key={idx}
                  // super={idx === 2}
                  handleCard={() => {
                    props.history.push(`/profissionais/${item?.id}`);
                  }}
                  image={item?.image}
                  name={item?.name}
                  profession={item?.categories}
                  user={user}
                  value={
                    item?.price
                      ? `€ ${item.price.toFixed(2)} ${
                          item.user_info.remuneration_type === 1
                            ? " hora"
                            : item.user_info.remuneration_type === 2
                            ? " dia"
                            : " mês"
                        }`
                      : null
                  }
                  verified={item?.user_info?.verified}
                />
              ))}
            </GridCards>
          ) : (
            <EmptyState>
              <HeaderEmpty as="h3">Sem resultados</HeaderEmpty>
              <TextEmpty>
                Para encontrar mais resultados, ajuste sua busca.
              </TextEmpty>
              <Divider
                paddingTop="1rem"
                width="100%"
                borderColor="#ddd"
                borderWidth="2px"
                cursor="default"
              />
            </EmptyState>
          )}
        </>
      )}
      {!loading && Math.ceil(count / 20) > 1 && (
        <ContainerPaginate id="react-paginate">
          <ReactPaginate
            previousLabel={"Anterior"}
            nextLabel={"Próximo"}
            breakLabel={"..."}
            breakClassName={"break-me"}
            pageCount={Math.ceil(count / 20)}
            marginPagesDisplayed={width <= 320 ? 0 : 1}
            pageRangeDisplayed={width <= 440 ? 1 : 3}
            forcePage={pageNumber}
            onPageChange={({ selected }) => handlePageClick(selected)}
            containerClassName={"pagination"}
            activeClassName={"active"}
          />
        </ContainerPaginate>
      )}
    </Container>
  );
};

export default SearchProfessionals;

const Container = styled(Box)`
  min-height: 100px;
  height: 100%;
  /* width: 100%; */
  cursor: pointer;
  padding: 4rem 0;
  max-width: ${(props) => props.theme.queries.xl};
  margin: 0 auto;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    padding: 4rem 1rem;
  }
`;

const Title = styled(Box)`
  cursor: default;
  margin: 1rem 0;
`;

const ContainerFilters = styled(Box)`
  margin-top: 2rem;
  display: flex;
  align-items: center;
  @media (max-width: ${(props) => props.theme.queries.xl}) {
    flex-wrap: wrap;
  }
`;

const GridCards = styled(Box)`
  cursor: default;
  margin-top: 5rem;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-gap: 50px 30px;
  @media (max-width: ${(props) => props.theme.queries.md}) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const ContainerPaginate = styled(Box)`
  margin-top: 5rem;
`;

//empty

const EmptyState = styled(Flex)`
  margin: 3rem 0;
  flex-direction: column;
  cursor: default;
`;

const HeaderEmpty = styled(Heading)`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 600;
`;

const TextEmpty = styled(Text)`
  margin: 0.4rem 0 0 0;
  font-size: 1.1rem;
`;
