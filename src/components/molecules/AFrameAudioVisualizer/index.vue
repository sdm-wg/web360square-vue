<template>
  <a-entity
    class="clickable"
    geometry="primitive: sphere"
    :position="position"
    scale="0.3 0.3 0.3"
    material="color: cyan; transparent: true; opacity: 0.9,"
  >
  </a-entity>
</template>

<script>
export default {
  name: "AFrameAudioVisualizer",
  props: {
    position: Object,
  },
};
</script>
