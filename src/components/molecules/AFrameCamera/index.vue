<template>
  <a-entity camera look-controls position="0 1.6 0"> </a-entity>
</template>

<script>
const AudioContext = window.AudioContext || window.webkitAudioContext;

export default {
  name: "AFrameCamera",
  props: {
    audioContext: AudioContext,
  },
};
</script>
