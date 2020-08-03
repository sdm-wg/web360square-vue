export const sparqlAxios = (axios, url, successCallback, errorCallback) => {
  axios
    .get(url, { headers: new Headers({ accept: "application/json" }) })
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
};

export const sparqlEndpointUrl =
  "http://sdm.hongo.wide.ad.jp:7200/repositories/web360square-vue";

export const eventQuery = `\
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

export const viewerQuery = (eventId) => {
  return `\
    PREFIX schema: <http://schema.org/>
    PREFIX sdm: <http://sdm.hongo.wide.ad.jp/resource/>
    PREFIX sdmo: <http://sdm.hongo.wide.ad.jp/sdmo/>

    select distinct ?playerClass ?contentUrl ?eventTime ?startAt ?endAt ?x ?y ?z where {
        ?player
            a ?playerClass ;
            schema:name "Web360Square" ;
            sdmo:plays sdm:${eventId} ;
            sdmo:inputFrom ?compositeMedia.
        ?compositeMedia
            schema:contentUrl ?contentUrl ;
            sdmo:includes ?mediaEvent .
        ?mediaEvent
            sdmo:refers ?media ;
            sdmo:eventTime ?eventTime .
        ?media
            sdmo:inputFrom ?recorder ;
            sdmo:startAt ?startAt ;
            sdmo:endAt ?endAt .
        ?recorder
            sdmo:localX ?x ;
            sdmo:localY ?y ;
            sdmo:localZ ?z .
    }
    `;
};

export const parseEvent = (dataArray) => {
  let events = [];

  for (let data of dataArray) {
    const eventUri = data.event.value;
    const eventId = eventUri.split("/").pop();
    const eventName = data.eventName.value;
    const eventDate = data.eventDate.value;
    const eventPlaceName = data.eventPlaceName.value;
    const eventPlaceAddress = data.eventPlaceAddress.value;

    events.push({
      id: eventId,
      name: eventName,
      date: eventDate,
      place: {
        name: eventPlaceName,
        address: eventPlaceAddress,
      },
    });
  }

  return events;
};

export const parseViewer = (dataArray) => {
  let ViewerData = {
    duration: 0,
    playlistFile: "",
    audioFile: "",
    spriteTimes: [],
    positions: [],
  };

  for (let data of dataArray) {
    const contentUrl = data.contentUrl.value;
    const playerClassUri = data.playerClass.value;
    const startAt = parseFloat(data.startAt.value);
    const endAt = parseFloat(data.endAt.value);

    // calc min(endAt - startAt)
    if (ViewerData.duration === 0) {
      ViewerData.duration = endAt - startAt;
    } else {
      ViewerData.duration = Math.min(ViewerData.duration, endAt - startAt);
    }

    if (playerClassUri.match(/VideoPlayer/)) {
      ViewerData.playlistFile = contentUrl;
    } else if (playerClassUri.match(/AudioPlayer/)) {
      ViewerData.audioFile = contentUrl;

      const eventTime = parseFloat(data.eventTime.value);
      const x = parseFloat(data.x.value);
      const y = parseFloat(data.y.value);
      const z = parseFloat(data.z.value);

      // set temporal value on `end`
      ViewerData.spriteTimes.push({ start: eventTime, end: eventTime });
      ViewerData.positions.push({ x: x, y: y, z: z });
    }
  }

  for (let i = 0, len = ViewerData.spriteTimes.length; i < len; i++) {
    ViewerData.spriteTimes[i].end += ViewerData.duration;
  }

  return ViewerData;
};
