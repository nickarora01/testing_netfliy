import { thunk, action, actionOn } from "easy-peasy";
import { get } from "lodash";
import history from "../utils/history";
import { arrayToObjectString } from "../utils/helper";
import {
  ListProductSeries,
  ListProductTypeMaterials,
  ListCategories,
  ListProductByCategory,
  ListProductByFilter,
  ListPrices
} from "../services/home";
import uniqBy from "lodash/uniqBy";

const home = {
  isLoading: false,
  error: "",
  category_id: "",
  author_id: "",
  series: [],
  materials: [],
  search: "",
  prices: [],
  categories: [],
  productsHomeOne: [],
  productsHomeTwo: [],
  productsHomeThree: [],
  products: [],
  serieFilters: [],
  materialFilters: [],
  priceFilters: [],
  selectedFilters: [],
  getSeries: thunk(async (action, payload) => {
    try {
      const response = await ListProductSeries();
      action.setResult({
        type: "PRODUCT_SERIES",
        query: payload,
        data: response.data
      });
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  getPrices: thunk(async (action, payload) => {
    try {
      const response = await ListPrices();
      action.setResult({
        type: "PRODUCT_PRICES",
        query: payload,
        data: response.data
      });
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  getMaterials: thunk(async (action, payload) => {
    try {
      const response = await ListProductTypeMaterials();
      action.setResult({
        type: "PRODUCT_TYPE_MATERIALS",
        query: payload,
        data: response.data
      });
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  getCategories: thunk(async action => {
    try {
      const response = await ListCategories();
      action.setResult({ type: "CATEGORIES", data: response.data });
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  getProducts: thunk(async (action, payload) => {
    try {
      const response = await ListProductByCategory(payload.id);
      action.setResult({ type: payload.type, data: response.data });
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  listProducts: thunk(async (action, payload) => {
    try {
      action.setLoading({ loading: true });
      const response = await ListProductByFilter(payload);
      action.setResult({ type: "PRODUCT_LIST", data: response.data });
      action.setLoading({ loading: false });
    } catch (error) {
      action.setError({ message: "Error" });
    }
  }),
  setResult: action((state, payload) => {
    switch (payload.type) {
      case "PRODUCT_SERIES":
        state.series = get(payload.data, "results", []);
        state.serieFilters = [];

        if (!payload.query || payload.query.length === 0) {
          state.series.forEach(item => {
            item.checked = false;
          });
        } else {
          for (let item of state.series) {
            const serie = payload.query.find(f => f === item.id);
            if (serie) {
              item.checked = true;
              state.serieFilters.push(item.id);
              item.type = "series";
              state.selectedFilters.push(item);
              state.selectedFilters = uniqBy(state.selectedFilters, "id");
            } else {
              item.checked = false;
            }
          }
        }
        break;
      case "PRODUCT_TYPE_MATERIALS":
        state.materials = get(payload.data, "results", []);
        state.materialFilters = [];
        if (!payload.query || payload.query.length === 0) {
          state.materials.forEach(item => {
            item.checked = false;
          });
        } else {
          for (let item of state.materials) {
            const material = payload.query.find(f => f === item.id);
            if (material) {
              item.checked = true;
              state.materialFilters.push(item.id);
              item.type = "materials";
              state.selectedFilters.push(item);
              state.selectedFilters = uniqBy(state.selectedFilters, "id");
            } else {
              item.checked = false;
            }
          }
        }
        break;
      case "PRODUCT_PRICES":
        state.prices = get(payload.data, "results", []);
        state.priceFilters = [];
        if (!payload.query || payload.query.length === 0) {
          state.prices.forEach(item => {
            item.checked = false;
          });
        } else {
          for (let item of state.prices) {
            const price = payload.query.find(f => f === item.key);
            if (price) {
              item.checked = true;
              state.priceFilters.push(item.id);
              item.type = "prices";
              state.selectedFilters.push(item);
              state.selectedFilters = uniqBy(state.selectedFilters, "id");
            } else {
              item.checked = false;
            }
          }
        }
        break;
      case "CATEGORIES":
        state.categories = get(payload.data, "results", []);
        break;
      case "PRODUCT_HOME_1":
        state.productsHomeOne = payload.data;
        break;
      case "PRODUCT_HOME_2":
        state.productsHomeTwo = payload.data;
        break;
      case "PRODUCT_HOME_3":
        state.productsHomeThree = payload.data;
        break;
      case "PRODUCT_LIST":
        state.products = payload.data;
        break;
    }
  }),
  setSerieFilters: action((state, payload) => {
    state.series.forEach(item => {
      if (payload === item.id) {
        item.checked = !item.checked;
        if (item.checked) {
          state.serieFilters.push(item.id);
          item.type = "series";
          state.selectedFilters.push(item);
        } else {
          if (state.serieFilters.length > 1) {
            state.serieFilters = state.serieFilters.filter(
              filter => filter !== item.id
            );
            state.selectedFilters = state.selectedFilters.filter(
              filter => filter.title !== item.title
            );
          } else {
            state.serieFilters = [];
          }
        }
      }
      state.selectedFilters = uniqBy(state.selectedFilters, "id");
    });
  }),
  setPriceFilters: action((state, payload) => {
    state.prices.forEach(item => {
      if (payload === item.key) {
        item.checked = !item.checked;
        if (item.checked) {
          state.priceFilters.push(item.key);
          item.type = "prices";
          state.selectedFilters.push(item);
        } else {
          state.priceFilters = state.priceFilters.filter(
            filter => filter !== item.key
          );
          state.selectedFilters = state.selectedFilters.filter(
            filter => filter.title !== item.title
          );
        }
      }
      state.selectedFilters = uniqBy(state.selectedFilters, "id");
    });
  }),
  setMaterialFilters: action((state, payload) => {
    state.materials.forEach(item => {
      if (payload === item.id) {
        item.checked = !item.checked;
        if (item.checked) {
          state.materialFilters.push(item.id);
          item.type = "materials";
          state.selectedFilters.push(item);
        } else {
          if (state.materialFilters.length > 1) {
            state.materialFilters = state.materialFilters.filter(
              filter => filter !== item.id
            );
            state.selectedFilters = state.selectedFilters.filter(
              filter => filter.title !== item.title
            );
          } else {
            state.materialFilters = [];
          }
        }
      }
      state.selectedFilters = uniqBy(state.selectedFilters, "id");
    });
  }),
  setLoading: action((state, payload) => {
    const loading = get(payload, "loading", false);
    state.isLoading = loading;
  }),
  setAuthorId: action((state, payload) => {
    state.author_id = payload;
  }),
  setError: action((state, payload) => {
    const message = get(payload, "message", false);
    state.error = message;
  }),
  setClearFilter: action(state => {
    state.materialFilters = [];
    state.serieFilter = [];
    state.priceFilters = [];
    state.selectedFilters = [];
  }),
  setRemoveSelectedFilters: action((state, payload) => {
    state.selectedFilters = state.selectedFilters.filter(
      filter => filter.title !== payload.title
    );
  }),
  setCategoryId: action((state, payload) => {
    state.category_id = payload;
  }),
  setSearch: action((state, payload) => {
    state.search = payload;
  }),
  onSerieFilter: actionOn(
    (_, storeActions) => storeActions.home.setSerieFilters,
    state => {
      const model = JSON.parse(JSON.stringify(state));
      const serieStr = arrayToObjectString(model.serieFilters);
      const materialsStr = arrayToObjectString(model.materialFilters);
      const pricesStr = arrayToObjectString(model.priceFilters);
      const categoryId = model.category_id;
      const authorId = model.author_id;

      if (window.location.pathname === "/") {
        history.push(
          `/produtos?start=0&limit=20&pageNumber=0&sort=Mais Recente&series=${serieStr}&materials=${materialsStr}&prices=${pricesStr}&category_id=${categoryId}&author=${authorId}`
        );
      } else {
        history.replace({
          pathname: "/produtos",
          search: `?start=0&limit=20&pageNumber=0&sort=Mais Recente&series=${serieStr}&materials=${materialsStr}&prices=${pricesStr}&category_id=${categoryId}&author=${authorId}`,
          state: { some: "state" }
        });
      }
    }
  ),
  onPriceFilter: actionOn(
    (_, storeActions) => storeActions.home.setPriceFilters,
    state => {
      const model = JSON.parse(JSON.stringify(state));
      const serieStr = arrayToObjectString(model.serieFilters);
      const materialsStr = arrayToObjectString(model.materialFilters);
      const pricesStr = arrayToObjectString(model.priceFilters);
      const categoryId = model.category_id;
      const authorId = model.author_id;

      if (window.location.pathname === "/") {
        history.push(
          `/produtos?start=0&limit=20&pageNumber=0&sort=Mais Recente&series=${serieStr}&materials=${materialsStr}&prices=${pricesStr}&category_id=${categoryId}&author=${authorId}`
        );
      } else {
        history.replace({
          pathname: "/produtos",
          search: `?start=0&limit=20&pageNumber=0&sort=Mais Recente&series=${serieStr}&materials=${materialsStr}&prices=${pricesStr}&category_id=${categoryId}&author=${authorId}`,
          state: { some: "state" }
        });
      }
    }
  ),
  onMaterialFilter: actionOn(
    (_, storeActions) => storeActions.home.setMaterialFilters,
    state => {
      const model = JSON.parse(JSON.stringify(state));
      const serieStr = arrayToObjectString(model.serieFilters);
      const materialsStr = arrayToObjectString(model.materialFilters);
      const pricesStr = arrayToObjectString(model.priceFilters);
      const categoryId = model.category_id;
      const authorId = model.author_id;

      if (window.location.pathname === "/") {
        history.push(
          `/produtos?start=0&limit=20&pageNumber=0&sort=Mais Recente&series=${serieStr}&materials=${materialsStr}&prices=${pricesStr}&category_id=${categoryId}&author=${authorId}`
        );
      } else {
        history.replace({
          pathname: "/produtos",
          search: `?start=0&limit=20&pageNumber=0&sort=Mais Recente&series=${serieStr}&materials=${materialsStr}&prices=${pricesStr}&category_id=${categoryId}&author=${authorId}`,
          state: { some: "state" }
        });
      }
    }
  )
};

export default home;
