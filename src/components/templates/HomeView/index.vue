<template>
  <div class="w-screen h-screen bg-black">
    <transition name="fade" mode="out-in">
      <!-- First View -->
      <div
        v-if="isFirstView"
        key="firstView"
        class="w-full h-full flex flex-col justify-center items-center"
      >
        <Logo class="w-1/2 h-1/2 object-contain" :isHorizontal="false" />
      </div>

      <!-- Main View -->
      <div
        v-else
        key="mainView"
        class="w-full h-full flex flex-col justify-center items-center"
      >
        <div class="w-1/5 p-2">
          <Logo class="w-full" :isHorizontal="true" />
        </div>
        <div
          class="w-full h-full pt-2 pl-8 pr-8 pb-8 flex flex-col justify-center items-center"
        >
          <CarouselSlider :events="events" />
        </div>
        />
      </div>
    </transition>
  </div>
</template>

<script>
import Logo from "@/components/atoms/Logo";
import CarouselSlider from "@/components/organisms/CarouselSlider";

export default {
  name: "HomeView",
  props: {
    isFirstView: Boolean,
    events: Array,
  },
  components: {
    Logo,
    CarouselSlider,
  },
};
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
