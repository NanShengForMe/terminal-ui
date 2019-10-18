import store from "@/store";
import { callAction } from "@/utils/request.js";

export const getMagnets = param =>
  callAction(store.getters.URL.getMagnets, param);
