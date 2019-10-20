import Vue from "vue";
import { cardLogin, weiXinLogin, logout } from "@/api/user.js";
import { setToken } from "@/utils/cookie";
export default {
  state: {
    user: Vue.ls.get("user", {})
  },
  mutations: {
    LOGIN: (state, user) => {
      state.user = user;
      Vue.ls.set("user", user);
    },
    LOGOUT: state => {
      state.user = {};
      Vue.ls.remove("user");
    },
    BILLANDCONFIGCACHE: (state, billAndConfigCache) => {
      state.billAndConfigCache = billAndConfigCache;
    },
    SORTEDNODECACHE: (state, sortedNodeCache) => {
      state.sortedNodeCache = sortedNodeCache;
    }
  },
  actions: {
    CardLogin({ commit }, token) {
      return new Promise((resolve, reject) => {
        cardLogin(token)
          .then(user => {
            if (user == null) {
              reject(new Error("未找到用户信息"));
            } else {
              commit("LOGIN", user);
              resolve(user);
            }
          })
          .catch(error => reject(error));
      });
    },
    weiXinLogin({ dispatch, commit }, token) {
      return new Promise((resolve, reject) => {
        weiXinLogin(token)
          .then(user => {
            if (user == null) {
              reject(new Error("未找到用户信息"));
            } else {
              dispatch("LoadCurrentProductCache");
              setToken(user.sessionId);
              commit("LOGIN", user);
              resolve(user);
            }
          })
          .catch(error => reject(error));
      });
    },
    Logout({ commit }) {
      return new Promise((resolve, reject) => {
        logout()
          .then(() => {
            commit("LOGOUT");
            resolve();
          })
          .catch(error => reject(error));
      });
    }
  },
  getters: {
    isLoggedIn: state => Object.keys(state.user).length > 0,
    user: state => state.user
  }
};
