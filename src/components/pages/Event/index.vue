<template>
  <EventView :viewerData="viewerData" />
</template>

<script>
import EventView from "@/components/templates/EventView";

import {
  sparqlAxios,
  sparqlEndpointUrl,
  viewerQuery,
  parseViewer,
} from "@/utils/sparql.js";
import { audioAxios } from "@/utils/audio.js";

export default {
  name: "Event",
  data: () => {
    return {
      viewerData: parseViewer([]),
      webAudio: {
        audioContext: null,
        audioBuffer: null,
      },
    };
  },
  computed: {
    eventId: function() {
      return this.$route.query.id;
    },
  },
  methods: {
    createAudioContext: function() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.webAudio.audioContext = new AudioContext();
    },
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
    loadAudio: function(audioFile) {
      audioAxios(
        this.axios,
        audioFile,
        (response) => {
          this.webAudio.audioContext.decodeAudioData(
            response.data,
            (buffer) => {
              this.webAudio.audioBuffer = buffer;
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );
    },
  },
  created: function() {
    this.createAudioContext();
    this.sparqlFetch(this.eventId);
  },
  watch: {
    eventId: function(val) {
      this.sparqlFetch(val);
    },
    "viewerData.audioFile": function(val) {
      if (val.startsWith("http")) {
        this.loadAudio(val);
      }
    },
  },
  components: {
    EventView,
  },
};
</script>
