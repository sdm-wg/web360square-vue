<template>
  <div class="w-full max-w-4xl h-full max-h-md mx-auto relative">
    <template v-for="(event, index) in events">
      <CarouselCard :key="index" :isActive="activeIndex === index" />
    </template>

    <div class="absolute inset-0 flex">
      <CarouselNextPrevButton :isNext="false" @prev="prev" />
      <CarouselNextPrevButton :isNext="true" @next="next" />
    </div>

    <div class="absolute w-full flex items-center justify-center px-4">
      <template v-for="(event, index) in events">
        <CarouselIndexButton
          :key="index"
          :isActive="activeIndex === index"
          @move="move(index)"
        />
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
  methods: {
    next: function() {
      this.activeIndex =
        (((this.activeIndex + 1) % this.events.length) + this.events.length) %
        this.events.length;
    },
    prev: function() {
      this.activeIndex =
        (((this.activeIndex - 1) % this.events.length) + this.events.length) %
        this.events.length;
    },
    move: function(index) {
      this.activeIndex = index;
    },
  },
  components: {
    CarouselIndexButton,
    CarouselNextPrevButton,
    CarouselCard,
  },
};
</script>
