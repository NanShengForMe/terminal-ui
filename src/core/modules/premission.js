import Vue from "vue";
import store from "@/store";
// https://router.vuejs.org/zh/guide/advanced/navigation-guards.html
import router from "@/router";

// http://ricostacruz.com/nprogress/
import NProgress from "nprogress";
import "nprogress/nprogress.css";

// 顶部进度条
NProgress.configure({
  showSpinner: false
});

// 全局前置守卫
router.beforeEach((to, from, next) => {
  NProgress.start();

  Vue.$log.debug(to, from);

  // 回到首页，清除已选产品
  if (to.path === "/") {
    store.dispatch("ClearCurrentProduct");
  }

  // 判断当前页面是否需要选择产品
  if (
    to.matched.some(record => record.meta.requiresProduct !== false) &&
    !store.getters.productCode
  ) {
    Vue.$log.debug(
      "this router need choose product, redirect to index:",
      from.fullPath
    );
    next({
      path: "/",
      query: {
        redirect: to.fullPath
      }
    });
    return;
  }

  // 判断页面是否不需要校验权限, 默认需要
  if (to.matched.some(record => record.meta.requiresAuth === false)) {
    next();
    return;
  }

  // 判断用户是否已经登录
  if (store.getters.isLoggedIn) {
    next();
    return;
  }

  Vue.$log.debug("this router need logged, redirect to login:", to.fullPath);
  Vue.prototype.$message.info("请登录后继续操作");
  // 跳转到登录页面
  next({
    name: "login",
    query: {
      redirect: to.fullPath
    }
  });
});

// 全局后置钩子
router.afterEach(() => {
  NProgress.done();
});

Vue.$log.debug("register vue-router interceptor finish");
