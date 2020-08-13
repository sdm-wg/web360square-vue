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
      :spectrumVector="spectrum.vector"
      :width="spectrum.width"
      :height="spectrum.height"
      :color="spectrum.color"
    />
  </a-entity>
</template>

<script>
import AFrameAudioSpectrum from "@/components/atoms/AFrameAudioSpectrum";

import { shuffledArray, arrayAverage, computedArrayChunk } from "@/utils/array";
import {
  audioVisualizers,
  registeredAudioVisualizer,
  calcHeight,
  calcColor,
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
      const gainNode = this.webAudio.gains[this.index];
      if (!gainNode) {
        return;
      }

      if (gainNode.gain.value === 0) {
        gainNode.gain.value = this.webAudio.maxVolume;
      } else {
        gainNode.gain.value = 0;
      }
    },
    updateValidFrequencyBand: function(
      frequencyData,
      frequencyBinCount,
      validFrequencyBand
    ) {
      const minValidIndex = frequencyData.findIndex((x) => x > 0);
      if (
        minValidIndex !== -1 &&
        (validFrequencyBand.min === null ||
          validFrequencyBand.min > minValidIndex)
      ) {
        validFrequencyBand.min = minValidIndex;
      }

      const revFrequencyData = [...frequencyData].reverse();
      const revMaxValidIndex = revFrequencyData.findIndex((x) => x > 0);
      const maxValidIndex = frequencyBinCount - revMaxValidIndex - 1;
      if (
        maxValidIndex !== frequencyBinCount &&
        (validFrequencyBand.max === null ||
          validFrequencyBand.max < maxValidIndex)
      ) {
        validFrequencyBand.max = maxValidIndex;
      }
    },
    generateValidFrequencyData: function(frequencyData, validFrequencyBand) {
      if (validFrequencyBand.min === null || validFrequencyBand.max === null) {
        return [...frequencyData];
      } else {
        return frequencyData.slice(
          validFrequencyBand.min,
          validFrequencyBand.max + 1
        );
      }
    },
    updateSpectrum: function(spectrums) {
      const analyzerNode = this.webAudio.analyzers[this.index];
      if (!analyzerNode) {
        return;
      }

      const frequencyBinCount = analyzerNode.frequencyBinCount;
      const frequencyData = new Uint8Array(frequencyBinCount);
      analyzerNode.getByteFrequencyData(frequencyData);

      this.updateValidFrequencyBand(
        frequencyData,
        frequencyBinCount,
        this.webAudio.validFrequencyBand
      );

      const validFrequencyData = this.generateValidFrequencyData(
        frequencyData,
        this.webAudio.validFrequencyBand
      );

      const computedValidFrequencyChunk = computedArrayChunk(
        validFrequencyData,
        spectrumVectors.length,
        (array) => {
          const average = arrayAverage(array);
          const normalized = average / 255;

          /*
           * Exponential amplification
           *   x: normalized [0, 1] -> y: amplified [0, 1]
           *   y = 1 - 2^(-10x) (~= 1 - exp(-7x))
           *   about 7-fold amplification (if x << 0)
           */
          const rate = 1 - 2 ** (-10 * normalized);
          return rate;
        }
      );

      for (const [i, rate] of Object.entries(computedValidFrequencyChunk)) {
        spectrums[i].height = calcHeight(rate);
        spectrums[i].color = calcColor(rate);
      }
    },
  },
  created: function() {
    for (const [i, spectrumVector] of Object.entries(
      shuffledArray(spectrumVectors)
    )) {
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
       *       watch `registeredAudioVisualizer.num` and
       *       reference `audioVisualizers[this.index]`
       */
      this.audioVisualizer = audioVisualizers[this.index];
    },
    "audioVisualizer.tickSignal": function() {
      if (this.audioVisualizer.initReady) {
        // Init
        this.audioVisualizer.initReady = false;
      } else {
        this.updateSpectrum(this.spectrums);

        /*
         * HACK: Spectrum changes will not be reflected
         *       unless this.spectrums reference is changed
         */
        this.spectrums = [...this.spectrums];
      }
    },
  },
  components: {
    AFrameAudioSpectrum,
  },
};
</script>
