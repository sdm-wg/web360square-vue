<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
    :width="width"
    viewBox="0 0 24 24"
  >
    <path v-if="isPlay" d="M3 22v-20l18 10-18 10z" />
    <path v-else d="M10 24h-6v-24h6v24zm10-24h-6v24h6v-24z" />
  </svg>
</template>

<script>
export default {
  name: "PlaySVG",
  props: {
    width: Number,
    isPlay: Boolean,
  },
};
</script>
