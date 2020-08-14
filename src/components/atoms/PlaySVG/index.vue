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
    <path v-else-if="isPlay" d="M7 18v-12l13 6-13 6z" />
    <path v-else d="M10.5 7h-2v10h2v-10zM13.5 7h2v10h-2v-10z" />
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
