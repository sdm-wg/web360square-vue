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
    const toggleViewDelay = 500;

    const sparqlEndpointUrl =
      "http://sdm.hongo.wide.ad.jp:7200/repositories/web360square-vue";
    const eventQuery = `\
      PREFIX schema: <http://schema.org/>
      PREFIX sdm: <http://sdm.hongo.wide.ad.jp/resource/>
      PREFIX sdmo: <http://sdm.hongo.wide.ad.jp/sdmo/>

      select distinct ?event ?eventName ?eventDate ?eventPlaceName ?eventPlaceAddress where {
        ?player
          schema:name "Web360Square" ;
          sdmo:plays ?event .
        ?event
          schema:name ?eventName ;
          schema:startDate ?eventDate ;
          schema:contentLocation ?eventPlace .
        ?eventPlace
          schema:name ?eventPlaceName ;
          schema:address ?eventPlaceAddress .
      }
      `;

    this.axios
      .get(`${sparqlEndpointUrl}?query=${encodeURIComponent(eventQuery)}`, {
        headers: new Headers({ accept: "application/json" }),
      })
      .then((response) => {
        this.events = [];

        const dataArray = response.data.results.bindings;
        for (let data of dataArray) {
          const eventUri = data.event.value;
          const eventId = eventUri.split("/").pop();
          const eventName = data.eventName.value;
          const eventDate = data.eventDate.value;
          const eventPlaceName = data.eventPlaceName.value;
          const eventPlaceAddress = data.eventPlaceAddress.value;
          this.events.push({
            id: eventId,
            name: eventName,
            date: eventDate,
            place: {
              name: eventPlaceName,
              address: eventPlaceAddress,
            },
          });
        }

        setTimeout(() => {
          this.isFirstView = false;
        }, toggleViewDelay);
      })
      .catch((error) => {
        console.log(error);
        this.events = [];

        setTimeout(() => {
          this.isFirstView = false;
        }, toggleViewDelay);
      });
  },
  components: {
    HomeView,
  },
};
</script>
