<template>
  <div class="w-full px-1 flex items-center">
    <span class="w-full font-bold text-2xl md:text-3xl lg:text-4xl text-center">
      {{ name }}
    </span>
  </div>
</template>

<script>
export default {
  name: "CarouselCardEventName",
  props: {
    name: String,
  },
};
</script>
