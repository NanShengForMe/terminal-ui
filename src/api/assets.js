import store from "@/store";
import { callAction } from "@/utils/request.js";

export const getAssetsList = queryParams =>
  callAction(store.getters.URL.getAssetsList, queryParams);
