import { getMagnets } from "@/api/magnet.js";

export default {
  state: {
    magnets: {}
  },
  mutations: {
    SET_MAGNETS: (state, payload) => {
      state.magnets = {
        ...state.magnets,
        [payload.productCode]: payload.magnets
      };
    },
    CLEAR_MAGNETS: (state, productCode) => {
      state.magnets[productCode] = null;
    }
  },
  actions: {
    LoadMagnets({ commit, getters }) {
      return new Promise((resolve, reject) => {
        const productCode = getters.productCode;
        getMagnets(productCode)
          .then(magnets => {
            commit("SET_MAGNETS", {
              productCode,
              magnets
            });
            resolve(magnets);
          })
          .catch(error => reject(error));
      });
    }
  },
  getters: {
    magnets: (state, getters) => state.magnets[getters.productCode]
  }
};
