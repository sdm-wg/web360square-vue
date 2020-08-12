<template>
  <a-entity
    :audio-visualizer="index"
    class="clickable"
    geometry="primitive: sphere"
    :position="position"
    scale="0.3 0.3 0.3"
    material="color: gray; transparent: true; opacity: 0"
    @mousedown="toggleGain"
  >
    <AFrameAudioSpectrum
      v-for="(spectrum, index) in spectrums"
      :key="index"
      :spectrum="spectrum"
    />
  </a-entity>
</template>

<script>
import AFrameAudioSpectrum from "@/components/atoms/AFrameAudioSpectrum";

import {
  audioVisualizers,
  registeredAudioVisualizer,
  spectrumVectors,
} from "@/utils/aframe/audioVisualizer";

export default {
  name: "AFrameAudioVisualizer",
  data: () => {
    return {
      audioVisualizer: null,
      registeredAudioVisualizer: registeredAudioVisualizer,
      spectrums: [],
    };
  },
  props: {
    index: Number,
    position: Object,
    webAudio: Object,
  },
  methods: {
    toggleGain: function() {
      if (this.gainNode.gain.value === 0) {
        this.gainNode.gain.value = this.webAudio.maxVolume;
      } else {
        this.gainNode.gain.value = 0;
      }
    },
  },
  computed: {
    gainNode: function() {
      return this.webAudio.gains[this.index];
    },
    analyzerNode: function() {
      return this.webAudio.analyzers[this.index];
    },
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
  mounted: function() {
    // HACK: re-reference `registeredAudioVisualizer`
    this.registeredAudioVisualizer = registeredAudioVisualizer;
  },
  watch: {
    "registeredAudioVisualizer.num": function() {
      /*
       * HACK: `audioVisualizers[this.index]` is sometimes not prepared on mounted
       *       watch `registeredAudioVisualizer.num` and reference `audioVisualizers[this.index]`
       */
      this.audioVisualizer = audioVisualizers[this.index];
    },
    "audioVisualizer.tickSignal": function() {
      // tick process
    },
  },
  components: {
    AFrameAudioSpectrum,
  },
};
</script>
