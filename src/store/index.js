// https://vuex.vuejs.org/zh/
import Vue from "vue";
import Vuex from "vuex";

import product from "./modules/app.js";
import magnet from "./modules/magnet.js";
import user from "./modules/user.js";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    magnet,
    product,
    user
  },
  strict: process.env.NODE_ENV !== "production"
});

Vue.$log.debug("register vuex finish");
