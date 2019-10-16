import store from "@/store";
import { callAction } from "@/utils/request.js";

export const billAndConfigCache = () =>
  callAction(store.getters.URL.billAndConfigCache);

export const sortedNodeCache = () =>
  callAction(store.getters.URL.sortedNodeCache);

export const queryProjectPayList = acceptanceId =>
  callAction(store.getters.URL.queryProjectPayList, {
    acceptanceId
  });
export const getPrintUrl = params =>
  callAction(store.getters.URL.getPrintUrl, params);
export const getTagAction = () => callAction(store.getters.URL.getTagAction);
