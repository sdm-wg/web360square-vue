<template>
  <button
    @click="move"
    class="flex-1 w-4 h-2 mt-4 mx-2 mb-0 rounded-full overflow-hidden transition-colors duration-200 ease-out hover:bg-orange-600 focus:outline-none"
    :class="{
      'bg-orange-400': isActive,
      'bg-orange-200': !isActive,
    }"
  ></button>
</template>

<script>
export default {
  name: "CarouselIndexButton",
  props: {
    isActive: Boolean,
  },
  methods: {
    move: function() {
      this.$emit("move");
    },
  },
};
</script>
