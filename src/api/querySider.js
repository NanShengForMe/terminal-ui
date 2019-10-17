import store from "@/store";
import { callAction } from "@/utils/request.js";

export const getAssetsType = businessType =>
  callAction(store.getters.URL.getAssetsType, businessType);

export const getBusinessType = businessRole =>
  callAction(store.getters.URL.getBusinessType, businessRole);

export const getBaseTeacher = params =>
  callAction(store.getters.URL.getBaseTeacher, params);

export const getBaseDep = params =>
  callAction(store.getters.URL.getBaseDep, params);

export const businessCodes = params =>
  callAction(store.getters.URL.businessCodes, params);
