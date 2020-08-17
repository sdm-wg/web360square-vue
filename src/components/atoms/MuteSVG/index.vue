<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
    :width="width"
    viewBox="0 0 24 24"
  >
    <path d="M2 9v6h5l5 5v-16l-5 5h-5z" />
    <path
      v-if="isMute"
      d="M14 9.5l1-1 2.5 2.5 2.5-2.5 1 1-2.5 2.5 2.5 2.5-1 1-2.5-2.5-2.5 2.5-1-1 2.5-2.5-2.5-2.5z"
    />
    <path
      v-else
      d="M14 9a3 3 0 0 1 0 6m0 3a6 6 0 0 0 0 -12v-2a8 8 0 0 1 0 16v-2z"
    />
  </svg>
</template>

<script>
export default {
  name: "MuteSVG",
  props: {
    width: Number,
    isMute: Boolean,
  },
};
</script>
