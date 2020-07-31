<template>
  <div
    v-show="isActive"
    class="w-full h-full p-10 font-bold text-5xl flex flex-col items-center bg-white text-black rounded-lg"
  >
    <!-- card elements -->
  </div>
</template>

<script>
export default {
  name: "CarouselCard",
  props: {
    isActive: Boolean,
  },
};
</script>
