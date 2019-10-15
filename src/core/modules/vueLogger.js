// https://github.com/justinkames/vuejs-logger
import Vue from "vue";
import VueLogger from "vuejs-logger";

const options = {
  // optional : defaults to true if not specified
  isEnabled: true,
  // required ['debug', 'info', 'warn', 'error', 'fatal']
  logLevel: process.env.NODE_ENV === "production" ? "error" : "debug",
  // optional : defaults to false if not specified
  stringifyArguments: false,
  // optional : defaults to false if not specified
  showLogLevel: true,
  // optional : defaults to false if not specified
  showMethodName: false,
  // optional : defaults to '|' if not specified
  separator: "-",
  // optional : defaults to false if not specified
  showConsoleColors: false
};

Vue.use(VueLogger, options);

Vue.$log.debug("register vuejs-logger finish");
