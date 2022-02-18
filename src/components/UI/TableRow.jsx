import React from "react";
import styled from "styled-components";
import { Table, Badge } from "evergreen-ui";

const TableRow = (props) => {
  const selectStatus = (status) => {
    switch (status) {
      case 1:
        return <Badge color="blue">Pendente</Badge>;
      case 2:
        return <Badge color="green">Pago</Badge>;
      case 3:
        return <Badge color="red">Erro</Badge>;
      case 4:
        return <Badge color="yellow">Cancelado</Badge>;
    }
  };

  return (
    <Row>
      {props.values.map((item, idx) => (
        <TextCell key={idx} flexBasis={item.flexBasis}>
          {item.value}
        </TextCell>
      ))}
      {props.status && <TextCell>{selectStatus(props.status)}</TextCell>}
      {props.children && props.children ? (
        <Table.Cell>{props.children}</Table.Cell>
      ) : (
        <></>
      )}
    </Row>
  );
};

export default TableRow;

const Row = styled(Table.Row)`
  height: 80px;
  padding-top: 5px;
  padding-bottom: 5px;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 600px;
  }
`;

const TextCell = styled(Table.TextCell)`
  span {
    font-size: 1rem !important;
  }
`;
