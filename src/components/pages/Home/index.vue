<template>
  <HomeView :isFirstView="isFirstView" :logos="logos" :events="events" />
</template>

<script>
import HomeView from "@/components/templates/HomeView";

export default {
  name: "Home",
  data: () => {
    return {
      isFirstView: true,
      logos: {
        firstView: {
          width: 280,
          isHorizontal: false,
        },
        mainView: {
          width: 180,
          isHorizontal: true,
        },
      },
      events: [],
    };
  },
  created: function() {
    // Dummy data-fetch process
    const toggleViewDelay = 1000;
    setTimeout(() => {
      this.isFirstView = false;

      // For caroucel debug
      const eventN = 5;
      this.events = new Array(eventN);
    }, toggleViewDelay);
  },
  components: {
    HomeView,
  },
};
</script>
