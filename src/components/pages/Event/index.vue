<template>
  <div></div>
</template>

<script>
import {
  sparqlAxios,
  sparqlEndpointUrl,
  viewerQuery,
  parseViewer,
} from "@/utils/sparql.js";

export default {
  name: "Event",
  data: () => {
    return {
      viewerData: parseViewer([]),
    };
  },
  computed: {
    eventId: function() {
      return this.$route.query.id;
    },
  },
  methods: {
    sparqlFetch: function(eventId) {
      sparqlAxios(
        this.axios,
        `${sparqlEndpointUrl}?query=${encodeURIComponent(
          viewerQuery(eventId)
        )}`,
        (response) => {
          const dataArray = response.data.results.bindings;
          this.viewerData = parseViewer(dataArray);
        },
        (error) => {
          console.error(error);
          this.viewerData = parseViewer([]);
        }
      );
    },
  },
  created: function() {
    this.sparqlFetch(this.eventId);
  },
  watch: {
    eventId: function(val) {
      this.sparqlFetch(val);
    },
  },
};
</script>
