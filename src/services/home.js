import { request } from "../utils/api";

export const ListProductSeries = () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "product_series"
  });
};

export const ListProductTypeMaterials = () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "product_type_materials"
  });
};

export const ListCategories = () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "categories"
  });
};

export const ListPrices = () => {
  return request({
    method: "get",
    baseUrl: "public",
    route: "product_prices?&sort=id-asc"
  });
};

export const ListProductByCategory = (id, start = 0, limit = 4) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: `categories/${id}/products?start=${start}&limit=${limit}&sort=id-desc`
  });
};

export const ListProductByFilter = ({
  search = "",
  series = "{}",
  materials = "{}",
  prices = "{}",
  category_id = "",
  author_id = "",
  start = 0,
  limit = 20,
  sort = "Mais Recente"
}) => {
  return request({
    method: "get",
    baseUrl: "public",
    route: `products?start=${start}&limit=${limit}&sort=${sort}&search=${search}&series=${series}&materials=${materials}&prices=${prices}&category_id=${category_id}&author_id=${author_id}`
  });
};
