import Vue from "vue";
import axios from "axios";
import { getConfig } from "@/api/app.js";
import { billAndConfigCache, sortedNodeCache } from "@/api/billLink.js";

export default {
  state: {
    config: {
      products: []
    },
    loading: false,
    currentProduct: Vue.ls.get("product", {})
  },
  mutations: {
    SET_CONFIG: (state, config) => {
      state.config = config;
      state.currentProduct = {};
      Vue.ls.remove("product");
    },
    SET_CURRENT_PRODUCT: (state, product) => {
      state.currentProduct = product;
      Vue.ls.set("product", product);
    },
    CLEAR_CURRENT_PRODUCT: state => {
      state.currentProduct = {};
      Vue.ls.remove("product");
    },
    SET_LOADING: (state, loading) => {
      state.loading = loading;
    }
  },
  actions: {
    LoadConfig({ commit }) {
      return new Promise((resolve, reject) => {
        getConfig()
          .then(config => {
            if (config) {
              commit("SET_CONFIG", config);
              resolve(config);
            } else {
              reject(new Error("未获取到配置信息"));
            }
          })
          .catch(error => reject(error));
      });
    },
    ToggleProduct({ state, commit }, productCode) {
      return new Promise((resolve, reject) => {
        const product = state.config.products.find(
          product => product.code === productCode
        );
        if (product) {
          commit("SET_CURRENT_PRODUCT", product);
          resolve();
        } else {
          reject(new Error(`没找到该产品: ${productCode}`));
        }
      });
    },
    ClearCurrentProduct({ commit }) {
      return new Promise(resolve => {
        commit("CLEAR_CURRENT_PRODUCT");
        resolve();
      });
    },
    Loading({ commit }, loading) {
      return new Promise(resolve => {
        commit("SET_LOADING", loading);
        resolve();
      });
    },
    LoadCurrentProductCache({ state, commit }) {
      return new Promise((resolve, reject) => {
        if (state.currentProduct.loadedBillCache === true) {
          reject();
        } else {
          axios
            .all([billAndConfigCache(), sortedNodeCache()])
            .then(
              axios.spread((billCache, nodeCache) => {
                const config = { ...state.config };
                let currentProduct;
                config.products.forEach(product => {
                  if (product.code !== state.currentProduct.code) {
                    return;
                  }
                  product.billAndConfigCache = billCache;
                  product.sortedNodeCache = nodeCache;
                  product.loadedBillCache = true;
                  currentProduct = product;
                });
                commit("SET_CONFIG", config);
                commit("SET_CURRENT_PRODUCT", currentProduct);

                // const product = { ...state.currentProduct };
                // product.billAndConfigCache = billCache;
                // product.sortedNodeCache = nodeCache;
                // product.loadedBillCache = true;

                // const index = config.products.findIndex(item => product.code === item.code);
                // const products = config.products.splice(index > 0 ? index - 1 : index, 1, product);
                // config.products = products;
                // commit("SET_CONFIG", config);
                // commit("SET_CURRENT_PRODUCT", product);
                resolve();
              })
            )
            .catch(error => Vue.$log.error(error));
        }
      });
    }
  },
  getters: {
    productCode: state => state.currentProduct.code,
    product: state => state.currentProduct,
    products: state => state.config.products,
    config: state => state.config,
    loading: state => state.loading,
    proxy: state => state.currentProduct.proxy,
    URL: state => state.currentProduct.url,
    loadedBillCache: state => state.loadedBillCache
  }
};
