<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    class="fill-current"
    :width="width"
    viewBox="0 0 24 24"
  >
    <template v-if="isLoading">
      <path d="M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v-2">
        <animateTransform
          attributeName="transform"
          type="rotate"
          dur="1s"
          from="0 12 12"
          to="360 12 12"
          repeatCount="indefinite"
        />
      </path>
    </template>
    <template v-else>
      <template v-if="currentRate">
        <circularProgressPath
          :progressRate="{ start: 0, end: 1 }"
          :center="center"
          :radius="radius"
          stroke="gray"
          stroke-width="1"
        />
        <circularProgressPath
          v-for="(bufferedRate, index) in bufferedRates"
          :key="index"
          :progressRate="bufferedRate"
          :center="center"
          :radius="radius"
          stroke="silver"
          stroke-width="1"
        />
        <circularProgressPath
          :progressRate="{ start: 0, end: currentRate }"
          :center="center"
          :radius="radius"
          stroke="white"
          stroke-width="2"
        />
      </template>
      <path v-if="isPlay" d="M7 18v-12l13 6-13 6z" />
      <path v-else d="M10.5 7h-2v10h2v-10zM13.5 7h2v10h-2v-10z" />
    </template>
  </svg>
</template>

<script>
import circularProgressPath from "@/components/atoms/circularProgressPath";

export default {
  name: "PlaySVG",
  data: () => {
    return {
      center: 12,
      radius: 10,
    };
  },
  props: {
    width: Number,
    isLoading: Boolean,
    isPlay: Boolean,
    currentRate: Number,
    bufferedRates: Array,
  },
  components: {
    circularProgressPath,
  },
};
</script>
