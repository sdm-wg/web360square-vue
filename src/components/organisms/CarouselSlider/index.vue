<template>
  <div class="w-full max-w-4xl h-full mx-auto relative">
    <template v-for="(event, index) in events">
      <CarouselCard :key="index" :isActive="activeIndex === index" />
    </template>

    <div class="absolute inset-0 flex">
      <CarouselNextPrevButton :isNext="false" />
      <CarouselNextPrevButton :isNext="true" />
    </div>

    <div class="absolute w-full flex items-center justify-center px-4">
      <template v-for="(event, index) in events">
        <CarouselIndexButton :key="index" :isActive="activeIndex === index" />
      </template>
    </div>
  </div>
</template>

<script>
import CarouselIndexButton from "@/components/atoms/CarouselIndexButton";
import CarouselNextPrevButton from "@/components/molecules/CarouselNextPrevButton";
import CarouselCard from "@/components/organisms/CarouselCard";

export default {
  name: "CarouselSlider",
  data: () => {
    return {
      activeIndex: 0,
    };
  },
  props: {
    events: Array,
  },
  components: {
    CarouselIndexButton,
    CarouselNextPrevButton,
    CarouselCard,
  },
};
</script>
