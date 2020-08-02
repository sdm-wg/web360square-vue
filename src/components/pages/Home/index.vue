<template>
  <HomeView :isFirstView="isFirstView" :events="events" />
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
        console.error(error);
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
