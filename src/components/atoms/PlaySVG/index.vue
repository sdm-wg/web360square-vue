<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :width="width"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M3 22v-20l18 10-18 10z" />
  </svg>
</template>

<script>
export default {
  name: "PlaySVG",
  props: {
    width: Number,
  },
};
</script>
