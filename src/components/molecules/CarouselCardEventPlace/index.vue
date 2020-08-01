<template>
  <div class="w-full px-1 flex flex-col justify-center">
    <span class="w-full font-bold text-xl md:text-2xl lg:text-3xl">
      {{ place.name }}
    </span>
    <span class="w-full text-md md:text-lg lg:text-xl">
      {{ place.address }}
    </span>
  </div>
</template>

<script>
export default {
  name: "CarouselCardEventPlace",
  props: {
    place: Object,
  },
};
</script>
