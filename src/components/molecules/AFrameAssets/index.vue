<template>
  <a-assets>
    <!-- src attribute is required (it can be empty) -->
    <video id="aframe-video" src="" crossorigin="anonymous" loop muted />
  </a-assets>
</template>

<script>
import { setupHls } from "@/utils/video.js";

let videoElement;

export default {
  name: "AFrameAssets",
  props: {
    playlistFile: String,
  },
  methods: {
    getVideoElement: function() {
      videoElement = document.getElementById("aframe-video");
    },
  },
  computed: {
    isPlaying() {
      return this.$store.getters["event/getIsPlaying"];
    },
  },
  mounted: function() {
    this.getVideoElement();
  },
  watch: {
    playlistFile: (val) => {
      if (val.startsWith("http")) {
        setupHls(videoElement, val);
      }
    },
    isPlaying: (val) => {
      if (!videoElement) {
        return;
      }

      if (videoElement.paused && val) {
        videoElement.play();
      } else if (!videoElement.paused && !val) {
        videoElement.pause();
      }
    },
  },
};
</script>
