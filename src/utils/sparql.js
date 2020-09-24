export const sparqlAxios = (axios, url, successCallback, errorCallback) => {
  axios
    .get(url, { headers: new Headers({ accept: "application/json" }) })
    .then((response) => successCallback(response))
    .catch((error) => errorCallback(error));
};

export const sparqlEndpointUrl =
  "https://sdm.hongo.wide.ad.jp:7200/repositories/web360square-vue";

export const eventQuery = `\
  PREFIX sdm: <http://sdm.hongo.wide.ad.jp/resource/>
  PREFIX sdmo: <http://sdm.hongo.wide.ad.jp/sdmo/>
  PREFIX schema: <http://schema.org/>

  SELECT DISTINCT ?event ?eventName ?eventDate ?eventPlaceName ?eventPlaceAddress WHERE {
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
    PREFIX sdm: <http://sdm.hongo.wide.ad.jp/resource/>
    PREFIX sdmo: <http://sdm.hongo.wide.ad.jp/sdmo/>
    PREFIX geom: <http://data.ign.fr/def/geometrie#>
    PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
    PREFIX schema: <http://schema.org/>

    SELECT DISTINCT ?playerClass ?contentUrl ?eventTime ?viewLabel ?startAt ?endAt ?x ?y ?z ?eulerDegX ?eulerDegY ?eulerDegZ ?eulerOrder WHERE {
      ?player
        a ?playerClass ;
        schema:name "Web360Square" ;
        sdmo:plays sdm:${eventId} ;
        sdmo:inputFrom ?compositeMedia.
      ?compositeMedia
        schema:contentUrl ?contentUrl ;
        sdmo:inputFrom ?processor .
      ?processor
        sdmo:inputFrom ?media .
      OPTIONAL {
        ?compositeMedia
          sdmo:hasMediaEvent ?mediaEvent .
        ?mediaEvent
          sdmo:hasMedia ?media ;
          sdmo:eventTime ?eventTime .
      }
      ?media
        sdmo:inputFrom ?recorder ;
        sdmo:startAt ?startAt ;
        sdmo:endAt ?endAt .
      OPTIONAL {
        ?media
          rdfs:label ?viewLabel .
      }
      ?recorder
        sdmo:geometoryAt ?geometry .
      ?geometry
        geom:coordX ?x ;
        geom:coordY ?y ;
        geom:coordZ ?z .
      OPTIONAL {
        ?geometry
          sdmo:eulerDegX ?eulerDegX ;
          sdmo:eulerDegY ?eulerDegY ;
          sdmo:eulerDegZ ?eulerDegZ ;
          sdmo:eulerOrder ?eulerOrder .
      }
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
  let viewerData = {
    duration: 0,
    audioFiles: [], // AudioSprite files
    videoList: [],
    audioList: [],
  };

  for (let data of dataArray) {
    const contentUrl = data.contentUrl.value;
    const playerClassUri = data.playerClass.value;
    const startAt = parseFloat(data.startAt.value);
    const endAt = parseFloat(data.endAt.value);
    const x = parseFloat(data.x.value);
    const y = parseFloat(data.y.value);
    const z = parseFloat(data.z.value);

    // calc min(endAt - startAt)
    if (viewerData.duration === 0) {
      viewerData.duration = endAt - startAt;
    } else {
      viewerData.duration = Math.min(viewerData.duration, endAt - startAt);
    }

    if (playerClassUri.match(/VideoPlayer/)) {
      const viewName = data.viewLabel.value;
      const eulerX = degToRad(parseFloat(data.eulerDegX.value));
      const eulerY = degToRad(parseFloat(data.eulerDegY.value));
      const eulerZ = degToRad(parseFloat(data.eulerDegZ.value));
      const eulerOrder = data.eulerOrder.value;

      viewerData.videoList.push({
        playlistFile: contentUrl,
        viewName: viewName,
        position: { x: x, y: y, z: z },
        euler: { x: eulerX, y: eulerY, z: eulerZ, order: eulerOrder },
      });
    } else if (playerClassUri.match(/AudioPlayer/)) {
      const eventTime = parseFloat(data.eventTime.value);

      if (!viewerData.audioFiles.includes(contentUrl)) {
        viewerData.audioFiles.push(contentUrl);
      }
      viewerData.audioList.push({
        audioFile: contentUrl,
        // set temporal value on `end`
        spriteTime: { start: eventTime, end: eventTime },
        position: { x: x, y: y, z: z },
        // set temporal position
        convertedPosition: { x: x, y: y, z: z },
      });
    }
  }

  for (let i = 0, len = viewerData.audioList.length; i < len; i++) {
    viewerData.audioList[i].spriteTime.end += viewerData.duration;
  }

  return viewerData;
};

const degToRad = (deg) => {
  return (deg * Math.PI) / 180;
};
