<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current stroke-current"
    :width="width"
    viewBox="0 0 24 24"
  >
    <path
      d="M1 9a14 14 0 0 1 22 0a14 14 0 0 1-22 0"
      fill="none"
      stroke-width="1.5"
    />
    <circle cx="12" cy="9" r="4" fill="none" stroke-width="1.5" />
    <text
      class="text-xs"
      text-anchor="middle"
      dominant-baseline="baseline"
      x="12"
      y="23"
      stroke="none"
    >
      beta
    </text>
  </svg>
</template>

<script>
export default {
  name: "ViewSVG",
  props: {
    width: Number,
  },
};
</script>
