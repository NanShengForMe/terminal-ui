import Vue from "vue";
// import store from "@/store";
import axios from "@/utils/request.js";
import { callAction } from "@/utils/request.js";

export const getCardToken = product => {
  // 轮询时不启用加载中的动画
  Vue.ls.set("ignoreOnceLoading", true);
  return axios({
    method: "get",
    url: "/login/card/token",
    params: {
      product
    }
  });
};

// export const cardLogin = token =>
//   callAction(store.getters.URL.cardLogin, token);

// export const weiXinLogin = token =>
//   callAction(store.getters.URL.weiXinLogin, token);

// export const logout = () => callAction(store.getters.URL.logout);

export const cardLogin = token =>
  axios({
    method: "post",
    url: "/login/card",
    params: {
      token
    }
  });

// export const weiXinLogin = token =>
//   axios({
//     method: "post",
//     url: "/login/weixin",
//     params: {
//       token
//     }
//   });
export const weiXinLogin = () =>
  callAction("base.login.login", {
    userid: "20032016",
    password: "20032016"
  });

export const logout = () =>
  axios({
    method: "get",
    url: "/logout"
  });
