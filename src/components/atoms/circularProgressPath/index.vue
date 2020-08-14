<template>
  <circle
    v-if="isFullCircle"
    :cx="center"
    :cy="center"
    :r="radius"
    fill="none"
  />
  <path v-else :d="pathData" fill="none" />
</template>

<script>
export default {
  name: "circularProgressPath",
  props: {
    progressRate: Object,
    center: Number,
    radius: Number,
  },
  methods: {
    generatePathData: function(rate1, rate2, c, r) {
      const rateDiff = rate2 - rate1;
      const largeArcFlag = rateDiff < 0.5 ? 0 : 1;

      const rad1 = rate1 * 2 * Math.PI;
      const x1 = r * Math.sin(rad1) + c;
      const y1 = -r * Math.cos(rad1) + c;

      const rad2 = rate2 * 2 * Math.PI;
      const x2 = r * Math.sin(rad2) + c;
      const y2 = -r * Math.cos(rad2) + c;

      return `M${x1} ${y1}A${r} ${r} 0 ${largeArcFlag} 1 ${x2} ${y2}`;
    },
  },
  computed: {
    isFullCircle: function() {
      return this.progressRate.start === 0 && this.progressRate.end === 1;
    },
    pathData: function() {
      const rate1 = this.progressRate.start;
      const rate2 = this.progressRate.end;
      return this.generatePathData(rate1, rate2, this.center, this.radius);
    },
  },
};
</script>
