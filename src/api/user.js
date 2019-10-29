import Vue from "vue";
import store from "@/store";
// import axios from "@/utils/request.js";
import { callAction } from "@/utils/request.js";

export const getCardToken = product => {
  // 轮询时不启用加载中的动画
  Vue.ls.set("ignoreOnceLoading", true);
  callAction(store.getters.URL.getCardToken, product);
};

export const cardLogin = token =>
  callAction(store.getters.URL.cardLogin, token);

// export const weiXinLogin = token =>
//   callAction(store.getters.URL.weiXinLogin, token);

// export const logout = () => callAction(store.getters.URL.logout);

// export const cardLogin = token =>
//   axios({
//     method: "post",
//     url: "/login/card",
//     params: {
//       token
//     }
//   });

// export const weiXinLogin = token =>
//   axios({
//     method: "post",
//     url: "/login/weixin",
//     params: {
//       token
//     }
//   });
// export const weiXinLogin = () =>
//   callAction("base.login.login", {
//     userid: "10277",
//     password: "1234"
//   });
export const weiXinLogin = token =>
  callAction(store.getters.URL.getQrCodeLoginInfo, {
    token
  });

// export const logout = () =>
//   axios({
//     method: "get",
//     url: "/logout"
//   });
export const logout = () => callAction(store.getters.URL.logout);

export const getAssetsMenu = param =>
  callAction(store.getters.URL.getAssetsMenu, param);
