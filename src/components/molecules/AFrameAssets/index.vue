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
  mounted: function() {
    this.getVideoElement();
  },
  watch: {
    playlistFile: (val) => {
      if (val.startsWith("http")) {
        setupHls(videoElement, val);
      }
    },
  },
};
</script>
