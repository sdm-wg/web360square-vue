<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
    :width="width"
    viewBox="0 0 24 24"
  >
    <path v-if="isLoading" d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v-2">
      <animateTransform
        attributeName="transform"
        type="rotate"
        dur="1s"
        from="0 12 12"
        to="360 12 12"
        repeatCount="indefinite"
      />
    </path>
    <path v-else-if="isPlay" d="M3 22v-20l18 10-18 10z" />
    <path v-else d="M10 24h-6v-24h6v24zm10-24h-6v24h6v-24z" />
  </svg>
</template>

<script>
export default {
  name: "PlaySVG",
  props: {
    width: Number,
    isLoading: Boolean,
    isPlay: Boolean,
  },
};
</script>
