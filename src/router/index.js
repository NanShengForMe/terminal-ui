// https://router.vuejs.org/zh/
import Vue from "vue";
import Router from "vue-router";
import Index from "@/views/Index.vue";

Vue.use(Router);

export default new Router({
  mode: "history",
  base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "index",
      component: Index,
      meta: {
        requiresAuth: false,
        requiresProduct: false,
        countDown: 0
      }
    },
    {
      path: "/magnet",
      name: "magnet",
      component: () => import("@/views/Magnet.vue")
    },
    {
      path: "/login",
      name: "login",
      component: () => import("@/views/Login.vue"),
      meta: {
        requiresAuth: false,
        countDown: 120
      }
    },
    {
      path: "/home",
      name: "home",
      component: () => import("@/views/Home.vue"),
      meta: {
        countDown: 180
      }
    },
    {
      path: "/assets",
      name: "assets",
      component: () => import("@/views/Assets.vue"),
      meta: {
        countDown: 180
      }
    },
    {
      path: "/business",
      name: "business",
      component: () => import("@/views/Business.vue")
    },
    {
      path: "/codeTag",
      name: "codeTag",
      component: () => import("@/views/CodeTag.vue")
    },
    {
      path: "/detailCodeTag/:printCode",
      name: "detailCodeTag",
      component: () => import("@/views/DetailInfoTag.vue")
    },
    {
      path: "/test",
      name: "test",
      component: () => import("@/views/Test.vue"),
      meta: {
        requiresAuth: false,
        requiresProduct: false,
        countDown: 0
      }
    }
  ]
});

Vue.$log.debug("register vue-router finish");
