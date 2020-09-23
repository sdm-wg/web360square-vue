<template>
  <a-entity
    :audio-visualizer="index"
    class="clickable"
    geometry="primitive: sphere; segmentsWidth: 9; segmentsHeight: 18"
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
      :visible="spectrum.visible"
    />
  </a-entity>
</template>

<script>
import AFrameAudioSpectrum from "@/components/atoms/AFrameAudioSpectrum";

import { shuffledArray, arrayAverage, computedArrayChunk } from "@/utils/array";
import {
  audioVisualizers,
  registeredAudioVisualizer,
  updateValidFrequencyBand,
  generateValidFrequencyData,
  calcHeight,
  calcColor,
  simplifiedGSS,
  visibleVectorFilter,
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
    mediaState: Object,
    eyeLevel: Number,
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

      /*
       * HACK: Gain node changes will not be observed
       *       unless this.webAudio.gains reference is changed
       */
      this.webAudio.gains = [...this.webAudio.gains];
    },
    updateSpectrum: function(spectrums) {
      const analyzerNode = this.webAudio.analyzers[this.index];
      if (!analyzerNode) {
        return;
      }

      const frequencyBinCount = analyzerNode.frequencyBinCount;
      const frequencyData = new Uint8Array(frequencyBinCount);
      analyzerNode.getByteFrequencyData(frequencyData);

      updateValidFrequencyBand(
        frequencyData,
        frequencyBinCount,
        this.webAudio.validFrequencyBand
      );

      const validFrequencyData = generateValidFrequencyData(
        frequencyData,
        this.webAudio.validFrequencyBand
      );

      const computedValidFrequencyChunk = computedArrayChunk(
        validFrequencyData,
        spectrums.length,
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
        if (
          !this.mediaState.isPlaying ||
          this.webAudio.gains[this.index].gain.value === 0
        ) {
          spectrums[i].height = 0.1;
          spectrums[i].color = "gray";
        } else {
          spectrums[i].height = calcHeight(rate);
          spectrums[i].color = calcColor(rate);
        }
      }
    },
  },
  created: function() {
    const spectrumVectors = simplifiedGSS(32);

    for (const [i, spectrumVector] of Object.entries(
      shuffledArray(spectrumVectors)
    )) {
      this.spectrums[i] = {
        vector: spectrumVector,
        width: 0.15,
        height: 0.1,
        color: "gray",
        visible: visibleVectorFilter(
          spectrumVector,
          this.position,
          this.eyeLevel
        ),
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
    position: function(val) {
      for (const i in this.spectrums) {
        this.spectrums[i].visible = visibleVectorFilter(
          this.spectrums[i].vector,
          val,
          this.eyeLevel
        );
      }
    },
  },
  components: {
    AFrameAudioSpectrum,
  },
};
</script>
