<template>
  <HomeView :isFirstView="isFirstView" :logos="logos" :events="events" />
</template>

<script>
import HomeView from "@/components/templates/HomeView";

import {
  sparqlAxios,
  sparqlEndpointUrl,
  eventQuery,
  parseEvent,
} from "@/utils/sparql.js";

export default {
  name: "Home",
  data: () => {
    return {
      isFirstView: true,
      logos: {
        firstView: {
          width: 280,
          isHorizontal: false,
        },
        mainView: {
          width: 180,
          isHorizontal: true,
        },
      },
      events: [],
    };
  },
  created: function() {
    const lazyTransition = () => {
      const delay = 500;
      setTimeout(() => {
        this.isFirstView = false;
      }, delay);
    };

    sparqlAxios(
      this.axios,
      `${sparqlEndpointUrl}?query=${encodeURIComponent(eventQuery)}`,
      (response) => {
        const dataArray = response.data.results.bindings;
        this.events = parseEvent(dataArray);
        lazyTransition();
      },
      (error) => {
        console.log(error);
        this.events = [];
        lazyTransition();
      }
    );
  },
  components: {
    HomeView,
  },
};
</script>
