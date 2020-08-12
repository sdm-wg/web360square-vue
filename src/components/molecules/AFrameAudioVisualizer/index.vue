<template>
  <a-entity
    class="clickable"
    geometry="primitive: sphere"
    :position="position"
    scale="0.3 0.3 0.3"
    material="color: gray; transparent: true; opacity: 0"
  >
  </a-entity>
</template>

<script>
import { spectrumVectors } from "@/utils/aframe/audioVisualizer";

export default {
  name: "AFrameAudioVisualizer",
  data: () => {
    return {
      spectrums: [],
    };
  },
  props: {
    position: Object,
  },
  created: function() {
    for (const [i, spectrumVector] of Object.entries(spectrumVectors)) {
      this.spectrums[i] = {
        vector: spectrumVector,
        width: 0.15,
        height: 0.1,
        color: "gray",
      };
    }
  },
};
</script>
