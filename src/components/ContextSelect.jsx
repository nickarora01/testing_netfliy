import React, { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { Box } from "@chakra-ui/react";
import { uniqBy, orderBy } from "lodash";
import styled from "styled-components";
import { Tooltip, InfoSignIcon } from "evergreen-ui";
import { useStore, useActions } from "../configureStore";
import LabelWithTooltip from "../components/LabelWithTooltip";

const ContextSelect = (props) => {
  const isLoading = useStore((state) => state.categories.isLoading);
  const list = useStore((state) => state.categories.categories);
  const getAll = useActions((action) => action.categories.getAll);
  const [defaultOpt, setDefaultOpt] = useState({});

  const _categories = list.filter(
    (c) =>
      list.filter((p) => p.parent_id > 0 && p.parent_id === c.id).length === 0
  );
  const categories = orderBy(
    _categories,
    [(item) => item.name.toLowerCase()],
    ["asc"]
  );

  useEffect(() => {
    getAll();
  }, []);

  useEffect(() => {
    let arr = [];

    let newObj = props.categoriesIds?.map((item) => {
      categories.find((z) => {
        if (z.id === item) {
          arr.push({
            label: z.name,
            value: z.id,
          });
        }
      });
    });

    setDefaultOpt(arr);
  }, [isLoading]);

  const getContextsForSelect = async (input) => {
    const result = categories.filter((item) =>
      item?.name?.toLowerCase()?.includes(input.toLowerCase())
    );
    const data = result?.map((item) => {
      return { label: item.name, value: item.id };
    });

    return uniqBy(data, "label");
  };

  return (
    <Container>
      <LabelWithTooltip
        label="Atividades em que pode trabalhar"
        infoMessage="Pode selecionar várias categorias, desde que tenha experiência concreta em cada uma das atividades marcadas"
      />
      {categories?.length === 0 && (
        <MySelect
          placeholder="Selecione suas atividades..."
          styles={{
            singleValue: (base) => ({
              ...base,
              padding: 5,
              borderRadius: 5,
              background: "gray",
              color: "white",
              display: "flex",
            }),
          }}
        />
      )}
      {defaultOpt?.length > 0 && categories?.length > 0 && (
        <MySelect
          placeholder="Selecione suas atividades..."
          styles={{
            singleValue: (base) => ({
              ...base,
              padding: 5,
              borderRadius: 5,
              background: "gray",
              color: "white",
              display: "flex",
            }),
          }}
          isMulti
          onChange={(e) => props.formik.setFieldValue("categories", e)}
          loadOptions={(e) => getContextsForSelect(e)}
          defaultValue={defaultOpt}
          cacheOptions
          defaultOptions
        />
      )}
      {categories?.length > 0 && defaultOpt?.length === 0 && (
        <MySelect
          placeholder="Selecione suas atividades..."
          styles={{
            singleValue: (base) => ({
              ...base,
              padding: 5,
              borderRadius: 5,
              background: "gray",
              color: "white",
              display: "flex",
            }),
          }}
          isMulti
          onChange={(e) => props.formik.setFieldValue("categories", e)}
          loadOptions={(e) => getContextsForSelect(e)}
          cacheOptions
          defaultOptions
        />
      )}
    </Container>
  );
};

export default ContextSelect;

const Container = styled(Box)`
  @media (max-width: ${(props) => props.theme.queries.sm}) {
    margin-bottom: 1rem;
  }
`;

const MySelect = styled(AsyncSelect)`
  height: 50px;
  margin-top: 0.1rem;
  .css-yk16xz-control {
    height: 50px;
    border: 2px solid #eee;
  }
  @media (max-width: ${(props) => props.theme.queries.i5}) {
    width: 102%;
  }
`;
const Label = styled.label`
  color: ${(props) => props.theme.color.green};
  font-weight: bold;
`;
