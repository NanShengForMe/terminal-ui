import axios from "@/utils/request.js";

export const getConfig = () =>
  axios({
    method: "get",
    url: "/config"
  });
