<template>
  <a-assets>
    <!-- src attribute is required (it can be empty) -->
    <video id="aframe-video" src="" crossorigin="anonymous" loop muted />
  </a-assets>
</template>

<script>
import { setupHls } from "@/utils/video.js";

export default {
  name: "AFrameAssets",
  data: () => {
    return {
      videoElement: undefined,
    };
  },
  props: {
    playlistFile: String,
  },
  methods: {
    getVideoElement: function() {
      this.videoElement = document.getElementById("aframe-video");
    },
    toggleVideoPlayPause: function(videoElement, isPlaying) {
      if (!videoElement) {
        console.warn("videoElement is not ready");
        return;
      }

      if (videoElement.paused && isPlaying) {
        videoElement.play();
      } else if (!videoElement.paused && !isPlaying) {
        videoElement.pause();
      }
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
    playlistFile: function(val) {
      if (val.startsWith("http")) {
        setupHls(this.videoElement, val);
      }
    },
    isPlaying: function(val) {
      this.toggleVideoPlayPause(this.videoElement, val);
    },
  },
};
</script>
