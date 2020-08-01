<template>
  <div class="w-full px-1 flex items-center">
    <span class="w-full font-bold text-xl md:text-2xl lg:text-3xl">
      {{ date }}
    </span>
  </div>
</template>

<script>
export default {
  name: "CarouselCardEventDate",
  props: {
    date: String,
  },
};
</script>
