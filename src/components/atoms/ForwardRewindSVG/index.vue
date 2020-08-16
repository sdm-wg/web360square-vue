<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
    :width="width"
    viewBox="0 0 24 24"
  >
    <path
      v-if="isForward"
      d="M12 2.5a9.5 9.5 0 1 0 9.5 9.5h-1a8.5 8.5 0 1 1-8.5-8.5v-1M12 0v6l3-3-3-3zm3 0v6l3-3-3-3"
    />
    <path
      v-else
      d="M12 2.5a9.5 9.5 0 1 1 -9.5 9.5h1a8.5 8.5 0 1 0 8.5-8.5v-1M12 0v6l-3-3 3-3zm-3 0v6l-3-3 3-3"
    />
    <text
      class="text-xs"
      text-anchor="middle"
      alignment-baseline="central"
      x="12"
      y="12"
    >
      {{ interval }}
    </text>
  </svg>
</template>

<script>
export default {
  name: "ForwardRewindSVG",
  props: {
    width: Number,
    isForward: Boolean,
    interval: Number,
  },
};
</script>
