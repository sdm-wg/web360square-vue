<template>
  <div
    v-show="isActive"
    class="w-full h-full flex bg-white text-black rounded-lg overflow-hidden leading-none"
  >
    <router-link to="/" class="w-full h-full flex items-center z-10">
    </router-link>
  </div>
</template>

<script>
export default {
  name: "CarouselCard",
  props: {
    isActive: Boolean,
    event: Object,
  },
};
</script>
