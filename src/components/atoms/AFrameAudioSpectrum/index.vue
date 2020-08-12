<template>
  <a-entity :geometry="geometry" :position="position" :material="material" />
</template>

<script>
export default {
  name: "AFrameAudioSpectrum",
  props: {
    spectrum: Object,
  },
  methods: {
    initQuaternion: function(element, spectrum) {
      if (element.object3D) {
        element.object3D.quaternion.setFromUnitVectors(
          element.object3D.up,
          spectrum.vector
        );
      }
    },
  },
  computed: {
    geometry: function() {
      return [
        `primitive: box;`,
        `width: ${this.spectrum.width};`,
        `height: ${this.spectrum.height};`,
        `depth: ${this.spectrum.width}`,
      ].join(" ");
    },
    position: function() {
      return this.spectrum.vector
        .clone()
        .multiplyScalar(this.spectrum.height / 2 + 1);
    },
    material: function() {
      return [
        `color: ${this.spectrum.color};`,
        `transparent: true;`,
        `opacity: 0.9`,
      ].join(" ");
    },
  },
  mounted: function() {
    this.initQuaternion(this.$el, this.spectrum);
  },
};
</script>
