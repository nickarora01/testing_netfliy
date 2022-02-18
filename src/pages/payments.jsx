import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { formatToDate, formatToBRL } from "brazilian-values";
import { Box, Flex, Button, Text } from "@chakra-ui/react";
import { Table, IconButton, Badge } from "evergreen-ui";
import { withRouter, useHistory } from "react-router-dom";
import queryString from "query-string";
import ReactPaginate from "react-paginate";
import { useStore, useActions } from "../configureStore";
import { TableHead, TableRow } from "../components/UI";
import { theme } from "../theme";
import { FormatToEuro } from "../utils/helper";

const Payments = (props) => {
  const user = useStore((state) => state.user.profile);
  const count = useStore((state) => state.order.count);
  const orders = useStore((state) => state.order.orders);
  const listOrders = useActions((state) => state.order.listOrders);

  const query = queryString.parse(props.location.search);
  const queryOffset = parseInt(query.start);
  const queryPageNumber = parseInt(query.pageNumber);
  const PER_PAGE = 12;

  const history = useHistory();
  const [offset, setOffset] = useState(queryOffset || 0);
  const [pageNumber, setPageNumber] = useState(queryPageNumber || 0 / PER_PAGE);

  const handlePageClick = (selected) => {
    const offset = Math.ceil(selected * PER_PAGE);
    const pageNumber = offset / PER_PAGE;

    setOffset(offset);
    setPageNumber(pageNumber);

    history.replace({
      pathname: "/conta",
      search: `?tab=${props.tab}&limit=${PER_PAGE}&start=${offset}&pageNumber=${pageNumber}`,
      state: { some: "state" },
    });
    return;
  };

  useEffect(() => {
    listOrders(offset);
  }, []);

  return (
    <Constainer>
      <CustomTable>
        <TableHead
          labels={[
            { title: "Data" },
            { title: "Valor" },
            { title: "Tipo" },
            { title: "Status" },
          ]}
        />
        <Table.Body overflow="hidden">
          {orders?.length > 0 ? (
            orders?.map((item, idx) => {
              return (
                <TableRow
                  key={idx}
                  actions={false}
                  values={[
                    { value: formatToDate(new Date(item?.created_at)) },
                    { value: <b>{FormatToEuro(item?.total)}</b> },
                    {
                      value: (
                        <Badge color="neutral">
                          {item?.type === 1 ? "Usuário" : "Trabalhador"}
                        </Badge>
                      ),
                    },
                  ]}
                  status={item?.status}
                />
              );
            })
          ) : (
            <Box
              height="150px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              Você não realizou nenhum pagamento!
            </Box>
          )}
        </Table.Body>
        {count > 12 && (
          <div id="react-paginate">
            {Math.ceil(count / PER_PAGE) > 1 && (
              <ReactPaginate
                previousLabel={"Anterior"}
                nextLabel={"Próximo"}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={Math.ceil(count / PER_PAGE)}
                marginPagesDisplayed={1}
                pageRangeDisplayed={3}
                forcePage={pageNumber}
                onPageChange={({ selected }) => handlePageClick(selected)}
                containerClassName={"pagination"}
                activeClassName={"active"}
              />
            )}
          </div>
        )}
      </CustomTable>
    </Constainer>
  );
};

export default withRouter(Payments);

const Constainer = styled(Box)`
  padding: 0rem 1rem 1rem 1rem;
  border-radius: 0.3rem;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 300px;
    overflow: auto;
  }
  @media (max-width: ${(props) => props.theme.queries.i5}) {
    width: 250px;
  }
`;

const CustomTable = styled(Table)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 600px;
  }
`;

// make payment container

const ContaynerMakePayment = styled(Box)`
  border: 1px solid #e4e7eb;
  border-radius: 0.3rem;
  padding: 1rem;
  margin-bottom: 4rem;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;
