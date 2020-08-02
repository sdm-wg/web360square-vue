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
