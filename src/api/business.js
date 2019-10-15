import store from "@/store";
import { callAction } from "@/utils/request.js";

export const getBusinessList = queryParams =>
  callAction(store.getters.URL.getBusinessList, queryParams);
