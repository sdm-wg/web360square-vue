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
      this.events = [
        {
          name:
            "慶應義塾大学コレギウム・ムジクム古楽オーケストラ演奏会－ドイツ管弦楽組曲の響き－",
          date: "2016-01-10T14:00:00.00+09:00",
          place: {
            name: "慶応大学日吉校舎藤原ホール",
            address: "神奈川県横浜市港北区日吉４−１−１",
          },
        },
        {
          name: "Live Music HACKASONG最終発表",
          date: "2017-01-26T18:30:00.00+09:00",
          place: {
            name: "Billboard Live TOKYO",
            address:
              "東京都港区赤坂9丁目7番4号 東京ミッドタウン ガーデンテラス4F",
          },
        },
      ];
    }, toggleViewDelay);
  },
  components: {
    HomeView,
  },
};
</script>
