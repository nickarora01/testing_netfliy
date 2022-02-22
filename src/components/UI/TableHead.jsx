import React from "react";
import styled from "styled-components";
import { Table, Label } from "evergreen-ui";

const CustomTable = (props) => {
  return (
    <CustomHead style={{ paddingRight: props.right ? props.right : 0 }}>
      {props.labels.map((item, idx) => (
        <Table.TextHeaderCell key={idx} paddingBottom={".5rem"}>
          <div
            style={{
              fontSize: "14px",
              color: "#B5B6BA",
              fontFamily: "revert",
            }}
          >
            {item.title}
          </div>
        </Table.TextHeaderCell>
      ))}
    </CustomHead>
  );
};

export default CustomTable;

const CustomHead = styled(Table.Head)`
  background-color: transparent;
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    width: 600px;
  }
`;
