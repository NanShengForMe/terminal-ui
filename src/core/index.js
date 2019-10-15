import Vue from "vue";

// 全局样式
import "@/styles/index.less";

// 日志输出
import "./modules/vueLogger.js";

// 本地存储
import "./modules/vueLs.js";

// ant-design按需加载
import "./modules/antDesign.js";

// 权限控制
import "./modules/premission.js";

import "./modules/filter";

// 开发环境引入mock模拟数据
if (process.env.NODE_ENV === "development") {
  require("@/mock");
}

Vue.$log.debug("init app finish");
