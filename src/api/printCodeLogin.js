import store from "@/store";
import { callAction } from "@/utils/request.js";

export const validatePrintCode = printCode =>
  callAction(store.getters.URL.validatePrintCode, printCode);

export const getPrintCodeInfo = params =>
  callAction(store.getters.URL.getPrintCodeInfo, params);
