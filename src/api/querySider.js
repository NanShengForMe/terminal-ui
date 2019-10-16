import store from "@/store";
import { callAction } from "@/utils/request.js";

export const getAssetsType = businessType =>
  callAction(store.getters.URL.getAssetsType, businessType);

export const getBusinessType = businessType =>
  callAction(store.getters.URL.getBusinessType, businessType);

export const getBaseTeacher = params =>
  callAction(store.getters.URL.getBaseTeacher, params);

export const getBaseDep = params =>
  callAction(store.getters.URL.getBaseDep, params);
