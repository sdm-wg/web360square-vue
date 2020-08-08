<template>
  <a-entity listener camera look-controls position="0 1.6 0"> </a-entity>
</template>

<script>
import { listener } from "@/utils/aframe/listener";

const AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
  name: "AFrameCamera",
  data: () => {
    return {
      listener: listener,
    };
  },
  props: {
    audioContext: AudioContext,
  },
  created: function() {
    // HACK: re-reference `listener`
    this.listener = listener;
  },
  watch: {
    "listener.tickSignal": function() {
      if (this.listener.initReady) {
        this.listener.initReady = false;
      }
    },
  },
};
</script>
