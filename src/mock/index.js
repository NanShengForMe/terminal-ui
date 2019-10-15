import Vue from "vue";
// http://mockjs.com/
import Mock from "mockjs";

import "./modules/app.js";
import "./modules/magnet.js";
import "./modules/user.js";
import "./modules/assets.js";
import "./modules/business.js";
import "./modules/querySider.js";
import "./modules/billLink.js";
import "./modules/printCodeLogin.js";

Mock.setup({
  // 延迟返回
  timeout: "100-1000"
});

Vue.$log.debug("register mockjs finish");
