// http://www.axios-js.com/
import Vue from "vue";
import Qs from "qs";
import store from "@/store";
import axios from "axios";
import { getCookie } from "@/utils/cookie";

console.log(getCookie("JSESSIONID"));
const instance = axios.create({
  timeout: 10000,
  withCredentials: true,
  headers: {
    common: {
      "X-Requested-With": "XMLHttpRequest"
    },
    "Content-Type": "application/x-www-form-urlencoded",
    Cookie: getCookie("JSESSIONID")
  }
});

instance.interceptors.request.use(
  config => {
    if (config.method === "get") {
      config.params = {
        ...config.params,
        ts: new Date().getTime()
      };
    }
    Vue.$log.debug(config);
    if (!Vue.ls.get("ignoreOnceLoading", false)) {
      store.dispatch("Loading", true);
    }
    return config;
  },
  error => {
    Vue.$log.warn(error);
    store.dispatch("Loading", false);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  response => {
    Vue.$log.debug(response);
    store.dispatch("Loading", false);
    if (response.status === 204) {
      response.data = null;
    }
    return response.data;
  },
  error => {
    Vue.$log.warn(error);
    store.dispatch("Loading", false);
    const response = error.response;
    if (!response) {
      return Promise.reject(error);
    }
    if (response.status === 401) {
      Vue.$log.warn("您没有登录或登录已超时");
    }
    if (response.status === 403) {
      Vue.$log.warn("您没有权限进行此操作");
    }
    return Promise.reject(error);
  }
);

export const callAction = (action, params = {}) => {
  if (!action) {
    throw new Error("action required non empty");
  }
  return instance({
    url: store.getters.proxy + "/e",
    method: "POST",
    data: Qs.stringify(
      {
        page: action,
        window_: "json",
        ...params
      },
      { arrayFormat: "brackets" }
    )
  });
};

export default instance;

Vue.$log.debug("create axios instance finish");
