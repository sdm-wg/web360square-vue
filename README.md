# Web360<sup>2</sup> (Vue.js edition)

[![Build Status](https://travis-ci.org/sdm-wg/web360square-vue.svg?branch=master)](https://travis-ci.org/sdm-wg/web360square-vue)
[![Coverage Status](https://coveralls.io/repos/github/sdm-wg/web360square-vue/badge.svg?branch=master)](https://coveralls.io/github/sdm-wg/web360square-vue?branch=master)

![web360square](https://user-images.githubusercontent.com/38515249/94381906-cef69500-0175-11eb-9ab6-f10183f8bffb.png)

## What is Web360<sup>2</sup>?

Web360<sup>2</sup> is an application that plays 360-degree video and object-based 3D sounds interactively on the Web.

This repository is a revised version of [sdm-wg/web360square](https://github.com/sdm-wg/web360square).

**Author**:

- Shin Kato

**Contributors**:

- Tomohiro Ikeda
- Mitsuaki Kawamorita
- Manabu Tsukada
- Hiroshi Esaki

**Citing Web360<sup>2</sup>**:

- SMC2020: <https://hal.archives-ouvertes.fr/hal-02869393/>
- DCC23 (Japanese): <https://ipsj.ixsq.nii.ac.jp/ej/?action=pages_view_main&active_action=repository_view_main_item_detail&item_id=200081&item_no=1&page_id=13&block_id=8>

### Usage

1. Access [Web360<sup>2</sup>](https://sdm-wg.github.io/web360square-vue/) (GitHub Pages hosted from this repository)

   ![screenshot-top](https://user-images.githubusercontent.com/38515249/94395386-8a312500-019a-11eb-98c2-fe004968b4c4.png)

2. Select an event

   ![screenshot-select-event](https://user-images.githubusercontent.com/38515249/94395605-ff9cf580-019a-11eb-9afa-f25a23e61060.png)

3. Enjoy watching

   ![screenshot-operation1](https://user-images.githubusercontent.com/38515249/94395901-a84b5500-019b-11eb-89bf-e742810503fb.png)

   ![screenshot-vue5d](https://user-images.githubusercontent.com/38515249/94395909-ac777280-019b-11eb-840d-2dffcd69acc5.png)

   ![screenshot-vue6d](https://user-images.githubusercontent.com/38515249/94395912-aed9cc80-019b-11eb-8c42-16e828e85fb7.png)

- Change viewpoints _(beta feature)_

  ![screenshot-vue7d](https://user-images.githubusercontent.com/38515249/94396023-fa8c7600-019b-11eb-87a0-0e7d00870e24.png)

  ![screenshot-vue8](https://user-images.githubusercontent.com/38515249/94396132-3a535d80-019c-11eb-9a76-986c5046d1a2.png)

## Integration with SDM Ontology

Web360<sup>2</sup> integrates with [SDM Ontology](https://sdm.wide.ad.jp/sdmo/), an ontology for the multi-media domain that models the workflow from recording to consumption.

This application uses an SDM Ontology-based linked open data (LOD):
fetching event information and viewer data (contents URL, media start/end time, recorder coordinates, and ...).

### SPARQL query

#### Fetch event information

![instance-fetch-event-information](https://user-images.githubusercontent.com/38515249/94400749-91f5c700-01a4-11eb-9558-7e0ffe16e476.png)

Search from the `sdmo:Player` class instance and fetch event information.

- yellow: the nodes and properties traced during the search
- blue: the information acquired as the result

```event.sparql
PREFIX sdm: <http://sdm.hongo.wide.ad.jp/resource/>
PREFIX sdmo: <http://sdm.hongo.wide.ad.jp/sdmo/>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?event ?eventName ?eventDate ?eventPlaceName ?eventPlaceAddress WHERE {
  VALUES ?playerClass {sdmo:Player sdmo:DataPlayer sdmo:AudioPlayer sdmo:VideoPlayer sdmo:CompositePlayer}
  ?player
    a ?playerClass ;
    schema:name "Web360Square" ;
    sdmo:plays ?event .
  ?event
    a sdmo:SDMEvent ;
    schema:name ?eventName ;
    schema:startDate ?eventDate ;
    schema:contentLocation ?eventPlace .
  ?eventPlace
    a schema:Place ;
    schema:name ?eventPlaceName ;
    schema:address ?eventPlaceAddress .
}
```

#### Fetch viewer data

![instance-fetch-viewer-data](https://user-images.githubusercontent.com/38515249/94400759-97531180-01a4-11eb-9aa0-cf4b81536c03.png)

Search from the `sdmo:Player` class instance and fetch viewer data.

- yellow: the nodes and properties traced during the search
- red: trace only if the node or property exists
- blue: the information acquired as the result

```viewer.sparql
PREFIX sdm: <http://sdm.hongo.wide.ad.jp/resource/>
PREFIX sdmo: <http://sdm.hongo.wide.ad.jp/sdmo/>
PREFIX geom: <http://data.ign.fr/def/geometrie#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX schema: <http://schema.org/>

SELECT DISTINCT ?playerClass ?contentUrl ?eventTime ?viewLabel ?startAt ?endAt ?x ?y ?z ?eulerDegX ?eulerDegY ?eulerDegZ ?eulerOrder WHERE {
  ?player
    a ?playerClass ;
    schema:name "Web360Square" ;
    # `eventId` is a JavaScript variable!
    sdmo:plays sdm:${eventId} ;
    sdmo:inputFrom ?appMedia.
  VALUES ?appMediaClass {sdmo:Media sdmo:DataMedia sdmo:AudioMedia sdmo:VideoMedia sdmo:CompositeMedia}
  ?appMedia
    a ?appMediaClass ;
    schema:contentUrl ?contentUrl ;
    sdmo:inputFrom ?processor .
  VALUES ?plocessorClass {sdmo:Processor sdmo:Generator sdmo:Converter sdmo:Analyzer sdmo:CompositeProcessor}
  ?processor
    a ?plocessorClass ;
    sdmo:inputFrom ?originalMedia .
  OPTIONAL {
    ?appMedia
      sdmo:hasMediaEvent ?mediaEvent .
    ?mediaEvent
      a sdmo:MediaEvent ;
      sdmo:hasMedia ?originalMedia ;
      sdmo:eventTime ?eventTime .
  }
  VALUES ?originalMediaClass {sdmo:Media sdmo:DataMedia sdmo:AudioMedia sdmo:VideoMedia sdmo:CompositeMedia}
  ?originalMedia
    a ?originalMediaClass ;
    sdmo:inputFrom ?recorder ;
    sdmo:startAt ?startAt ;
    sdmo:endAt ?endAt .
  OPTIONAL {
    ?originalMedia
      rdfs:label ?viewLabel .
  }
  VALUES ?recorderClass {sdmo:Recorder sdmo:DataRecorder sdmo:AudioRecorder sdmo:VideoRecorder sdmo:CompositeRecorder}
  ?recorder
    a ?recorderClass ;
    sdmo:geometryAt ?geometry .
  ?geometry
    a sdmo:Geometry ;
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
```

## Project setup

```
yarn install
```

### Compiles and hot-reloads for development

```
yarn serve
```

### Compiles and minifies for production

```
yarn build
```

### Run your unit tests

```
yarn test:unit
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
