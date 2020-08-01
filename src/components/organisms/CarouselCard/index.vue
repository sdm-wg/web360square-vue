<template>
  <div
    v-show="isActive"
    class="w-full h-full flex bg-white text-black rounded-lg overflow-hidden leading-none"
  >
    <router-link to="/" class="w-full h-full flex items-center z-10">
      <!-- Carousel Card Logo -->
      <div
        class="w-1/3 h-full bg-orange-500 hover:bg-red-500 flex justify-center items-center"
      >
        <div class="w-1/3">
          <PlaySVG class="w-full" />
        </div>
      </div>
    </router-link>
  </div>
</template>

<script>
import PlaySVG from "@/components/atoms/PlaySVG";

export default {
  name: "CarouselCard",
  props: {
    isActive: Boolean,
    event: Object,
  },
  components: {
    PlaySVG,
  },
};
</script>
