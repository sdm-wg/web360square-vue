import Vue from "vue";
import Vuex from "vuex";
import event from "./modules/event";

Vue.use(Vuex);

export default new Vuex.Store({
  modules: { event },
  strict: process.env.NODE_ENV !== "production",
});
