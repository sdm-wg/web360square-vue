<template>
  <img :width="width" alt="Web360Square" :src="imageSrc" />
</template>

<script>
export default {
  name: "Logo",
  props: {
    width: Number,
    isHorizontal: Boolean,
  },
  computed: {
    imageSrc: function() {
      if (this.isHorizontal) {
        return require("@/assets/images/logo-h.png");
      } else {
        return require("@/assets/images/logo-v.png");
      }
    },
  },
};
</script>
