<template>
  <a-entity camera look-controls position="0 1.6 0">
    <a-entity
      position="0 0 -1"
      cursor="rayOrigin: mouse"
      raycaster="objects: .clickable"
      geometry="primitive: ring; radiusInner: 0.02; radiusOuter: 0.03"
      material="color: black; shader: flat"
    >
    </a-entity>
  </a-entity>
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
