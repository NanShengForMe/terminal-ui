import Vue from "vue";
import moment from "moment";
import "moment/locale/zh-cn";
moment.locale("zh-cn");

Vue.filter("currency", function(value) {
  // return value ? value.toString().replace(/(\d)(?=(?:\d{3})+$)/g, "$1,") : "";
  return value
    ? String(value).replace(/\d{1,3}(?=(\d{3})+(\.|$))/g, "$&,")
    : "";
});

Vue.filter("format", function(value, pattern = "YYYY-MM-DD HH:mm:ss") {
  return value ? moment(value).format(pattern) : "";
});
