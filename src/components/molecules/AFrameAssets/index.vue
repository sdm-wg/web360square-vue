<template>
  <a-assets>
    <!-- src attribute is required (it can be empty) -->
    <video id="aframe-video" src="" crossorigin="anonymous" loop muted />
  </a-assets>
</template>

<script>
import {
  setupHls,
  looseSync,
  forceSync,
  calcBufferedRates,
} from "@/utils/video.js";

export default {
  name: "AFrameAssets",
  data: () => {
    return {
      videoElement: undefined,
    };
  },
  props: {
    playlistFile: String,
    duration: Number,
    currentTime: Number,
    mediaState: Object,
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
  mounted: function() {
    this.getVideoElement();
  },
  watch: {
    playlistFile: function(val) {
      if (val.startsWith("http")) {
        setupHls(this.videoElement, val);
        this.mediaState.isLoading.video = false;

        // HACK: handle `viewIndex` change
        this.toggleVideoPlayPause(this.videoElement, this.mediaState.isPlaying);
        this.mediaState.isForceSync = true;
      }
    },
    currentTime: function(val) {
      if (this.mediaState.isForceSync) {
        forceSync(this.videoElement, val);
        this.mediaState.isForceSync = false;
      } else {
        looseSync(this.videoElement, val);
      }

      this.mediaState.bufferedRates = calcBufferedRates(
        this.videoElement,
        this.duration
      );
    },
    "mediaState.isPlaying": function(val) {
      this.toggleVideoPlayPause(this.videoElement, val);
    },
  },
};
</script>
