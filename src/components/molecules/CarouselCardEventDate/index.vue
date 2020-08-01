<template>
  <div class="w-full flex">
    <!-- Calendar SVG -->
    <div class="w-8 md:w-16 px-1 flex justify-center items-center">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="w-full"
        viewBox="0 0 426.667 426.667"
        fill="black"
      >
        <rect x="213.333" y="234.667" width="106.667" height="106.667" />
        <path
          d="M362.667,42.667h-21.333V0h-42.667v42.667H128V0H85.333v42.667H64c-23.573,0-42.453,19.093-42.453,42.667L21.333,384
             c0,23.573,19.093,42.667,42.667,42.667h298.667c23.573,0,42.667-19.093,42.667-42.667V85.333
             C405.333,61.76,386.24,42.667,362.667,42.667z M362.667,384H64V149.333h298.667V384z"
        />
      </svg>
    </div>
    <!-- Date -->
    <div class="w-full px-1 flex items-center">
      <span class="w-full font-bold text-xl md:text-2xl lg:text-3xl">
        {{ formattedDate }}
      </span>
    </div>
  </div>
</template>

<script>
import moment from "moment";

export default {
  name: "CarouselCardEventDate",
  props: {
    date: String,
  },
  computed: {
    formattedDate: function() {
      const unixTime = Date.parse(this.date);
      return moment(unixTime).format("YYYY-MM-DD HH:mm:SS");
    },
  },
};
</script>
