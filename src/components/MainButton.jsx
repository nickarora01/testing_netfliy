import React from "react";
import styled from "styled-components";
import { theme } from "../theme";

const MainButton = props => (
  <CustomBlankButton
    fontSize={props.fontSize}
    width={props.width}
    marginTop={props.marginTop}
    onClick={props.onClick}
  >
    {props.label}
  </CustomBlankButton>
);

export default MainButton;

const CustomBlankButton = styled.button`
  height: 40px;

  width: ${({ width }) => (width !== undefined ? width : "260px")};
  border: none;
  background-color: transparent;
  color: ${theme.color.primary};
  border: 1px solid ${theme.color.primary};
  margin-top: ${({ marginTop }) =>
    marginTop !== undefined ? marginTop : "10px"};
  font-size: ${({ fontSize }) => (fontSize !== undefined ? fontSize : "12px")};
  cursor: pointer;
  font-weight: bold;
  border-radius: 18px;
  :focus {
    outline: none;
  }
  :hover {
    opacity: 0.5;
  }
`;
