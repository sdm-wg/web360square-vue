<template>
  <div class="w-full flex">
    <!-- Map Marker SVG -->
    <div class="w-8 md:w-16 px-1 flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-full"
        viewBox="0 0 510 510"
        fill="black"
      >
        <path
          d="M255,0C155.55,0,76.5,79.05,76.5,178.5C76.5,311.1,255,510,255,510s178.5-198.9,178.5-331.5C433.5,79.05,354.45,0,255,0z
             M255,242.25c-35.7,0-63.75-28.05-63.75-63.75s28.05-63.75,63.75-63.75s63.75,28.05,63.75,63.75S290.7,242.25,255,242.25z"
        />
      </svg>
    </div>
    <!-- Place -->
    <div class="w-full px-1 flex flex-col justify-center">
      <span class="w-full font-bold text-xl md:text-2xl lg:text-3xl">
        {{ place.name }}
      </span>
      <span class="w-full text-md md:text-lg lg:text-xl">
        {{ place.address }}
      </span>
    </div>
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
