<template>
  <div
    class="flex items-center w-1/2"
    :class="{
      'justify-start': !isNext,
      'justify-end': isNext,
    }"
  >
    <button
      class="bg-black text-white hover:text-orange-500 text-3xl font-bold rounded-full w-16 h-16 focus:outline-none z-20"
      :class="{
        '-ml-8': !isNext,
        '-mr-8': isNext,
      }"
      @click="isNext ? next() : prev()"
    >
      {{ arrow }}
    </button>
  </div>
</template>

<script>
export default {
  name: "CarouselNextPrevButton",
  props: {
    isNext: Boolean,
  },
  methods: {
    next: function() {
      this.$emit("next");
    },
    prev: function() {
      this.$emit("prev");
    },
  },
  computed: {
    arrow: function() {
      return this.isNext ? ">" : "<";
    },
  },
};
</script>
