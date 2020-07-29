<template>
  <img :width="width" alt="Web360Square" src="@/assets/images/logo-white.png" />
</template>

<script>
export default {
  name: "Logo",
  props: {
    width: Number,
  },
};
</script>
