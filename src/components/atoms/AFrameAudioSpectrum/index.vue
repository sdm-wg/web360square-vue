<template>
  <a-entity :geometry="geometry" :position="position" :material="material" />
</template>

<script>
export default {
  name: "AFrameAudioSpectrum",
  props: {
    spectrumVector: Object,
    width: Number,
    height: Number,
    color: String,
    visible: Boolean,
  },
  methods: {
    initQuaternion: function(element, spectrumVector) {
      if (element.object3D) {
        element.object3D.quaternion.setFromUnitVectors(
          element.object3D.up,
          spectrumVector
        );
      }
    },
  },
  computed: {
    geometry: function() {
      return [
        `primitive: box;`,
        `width: ${this.width};`,
        `height: ${this.height};`,
        `depth: ${this.width}`,
      ].join(" ");
    },
    position: function() {
      return this.spectrumVector.clone().multiplyScalar(this.height / 2 + 1);
    },
    material: function() {
      return [
        `color: ${this.color};`,
        `transparent: true;`,
        `opacity: 0.9`,
      ].join(" ");
    },
  },
  mounted: function() {
    this.initQuaternion(this.$el, this.spectrumVector);
    this.$el.setAttribute("visible", this.visible);
  },
  watch: {
    visible: function(val) {
      this.$el.setAttribute("visible", val);
    },
  },
};
</script>
