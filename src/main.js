import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import axios from "axios";
import VueAxios from "vue-axios";

import "aframe";
import "@/utils/aframe/listener";
import "@/utils/aframe/audioVisualizer";
import "@/assets/css/tailwind.css";

// Ignore A-Frame Elements
Vue.config.ignoredElements = [/^a-/];

Vue.config.productionTip = false;

Vue.use(VueAxios, axios);

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
