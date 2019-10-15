import store from "@/store";
import { callAction } from "@/utils/request.js";

export const getMagnets = () => callAction(store.getters.URL.getMagnets);
