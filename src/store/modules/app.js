import Vue from "vue";
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
              config.products.forEach(product => {
                commit("SET_CURRENT_PRODUCT", product);
                billAndConfigCache()
                  .then(response => {
                    product.billAndConfigCache = response;
                  })
                  .catch(error => {
                    Vue.$log.error(error);
                    product.billAndConfigCache = [];
                  });
                sortedNodeCache()
                  .then(response => (product.sortedNodeCache = response))
                  .catch(error => {
                    Vue.$log.error(error);
                    product.sortedNodeCache = [];
                  });
              });
              commit("CLEAR_CURRENT_PRODUCT");
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
    }
  },
  getters: {
    productCode: state => state.currentProduct.code,
    product: state => state.currentProduct,
    products: state => state.config.products,
    config: state => state.config,
    loading: state => state.loading,
    proxy: state => state.currentProduct.proxy,
    URL: state => state.currentProduct.url
  }
};
