import Vue from "vue";
import VueRouter from "vue-router";
import Home from "@/components/pages/Home";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/event",
    name: "Event",
    component: () => import("@/components/pages/Event"),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
