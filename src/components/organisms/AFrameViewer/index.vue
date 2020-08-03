<template>
  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="dotsColor: white; backgroundColor: black"
  >
  </a-scene>
</template>

<script>
export default {
  name: "AFrameViewer",
  props: {
    viewerData: Object,
  },
};
</script>
