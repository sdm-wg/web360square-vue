<template>
  <div
    v-show="isActive"
    class="w-full h-full flex bg-white text-black rounded-lg overflow-hidden leading-none"
  >
    <router-link to="/" class="w-full h-full flex items-center z-10">
      <!-- Card Logo -->
      <div
        class="w-1/3 h-full bg-orange-500 hover:bg-red-500 flex justify-center items-center"
      >
        <div class="w-1/3">
          <PlaySVG class="w-full" />
        </div>
      </div>
      <div class="w-2/3 h-full flex flex-col">
        <!-- Event Name -->
        <CarouselCardEventName class="h-1/2" :name="event.name" />
        <!-- Event Date -->
        <CarouselCardEventDate class="h-1/6" :date="event.date" />
      </div>
    </router-link>
  </div>
</template>

<script>
import PlaySVG from "@/components/atoms/PlaySVG";
import CarouselCardEventName from "@/components/molecules/CarouselCardEventName";
import CarouselCardEventDate from "@/components/molecules/CarouselCardEventDate";

export default {
  name: "CarouselCard",
  props: {
    isActive: Boolean,
    event: Object,
  },
  components: {
    PlaySVG,
    CarouselCardEventName,
    CarouselCardEventDate,
  },
};
</script>
