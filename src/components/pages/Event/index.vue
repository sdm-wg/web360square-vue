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
  created: function() {
    const eventId = this.$route.query.id;

    sparqlAxios(
      this.axios,
      `${sparqlEndpointUrl}?query=${encodeURIComponent(viewerQuery(eventId))}`,
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
};
</script>
