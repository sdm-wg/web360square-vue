<template>
  <EventView
    :viewerData="viewerData"
    :webAudio="webAudio"
    :mediaState="mediaState"
    :eyeLevel="eyeLevel"
    @togglePlayPause="togglePlayPause"
    @forwardRewind="forwardRewind"
    @toggleMute="toggleMute"
  />
</template>

<script>
import EventView from "@/components/templates/EventView";

import {
  sparqlAxios,
  sparqlEndpointUrl,
  viewerQuery,
  parseViewer,
} from "@/utils/sparql.js";
import { audioAxios } from "@/utils/audio.js";

export default {
  name: "Event",
  data: () => {
    return {
      viewerData: parseViewer([]),
      webAudio: {
        audioContext: null,
        audioBuffer: null,
        masterGain: null,
        compressor: null,
        sources: [],
        gains: [],
        analyzers: [],
        panners: [],
        currentTime: 0,
        pausedTime: {
          total: 0,
          range: { start: 0, end: null },
        },
        maxVolume: 1,
        validFrequencyBand: { min: null, max: null },
      },
      mediaState: {
        isLoading: { audio: true, video: true },
        isPlaying: false,
        isForceSync: false,
        currentRate: 0,
        bufferedRates: [],
      },
      eyeLevel: 1.6,
    };
  },
  computed: {
    eventId: function() {
      return this.$route.query.id;
    },
  },
  methods: {
    createAudioContext: function() {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.webAudio.audioContext = new AudioContext();
    },
    createMasterGain: function() {
      this.webAudio.masterGain = this.webAudio.audioContext.createGain();
    },
    createDynamicsCompressor: function() {
      this.webAudio.compressor = this.webAudio.audioContext.createDynamicsCompressor();
    },
    createBufferSource: function(i) {
      this.webAudio.sources[
        i
      ] = this.webAudio.audioContext.createBufferSource();
      this.webAudio.sources[i].buffer = this.webAudio.audioBuffer;
      this.webAudio.sources[i].loopStart = this.viewerData.spriteTimes[i].start;
      this.webAudio.sources[i].loopEnd = this.viewerData.spriteTimes[i].end;
    },
    createGain: function(i) {
      this.webAudio.gains[i] = this.webAudio.audioContext.createGain();
      this.webAudio.gains[i].gain.value = this.webAudio.maxVolume;
    },
    createAnalyzer: function(i) {
      this.webAudio.analyzers[i] = this.webAudio.audioContext.createAnalyser();
      /*
       * AnalyserNode.smoothingTimeConstant
       *   the averaging constant with the last analysis frame
       *   0: there is no averaging done
       *   1: overlap the previous and current buffer quite a lot while computing the value
       *   default: 0.8
       */
      this.webAudio.analyzers[i].smoothingTimeConstant = 0.7;
    },
    createPanner: function(i, pos) {
      this.webAudio.panners[i] = this.webAudio.audioContext.createPanner();
      this.webAudio.panners[i].panningModel = "equalpower";
      this.webAudio.panners[i].distanceModel = "inverse";
      this.webAudio.panners[i].setPosition(pos.x, pos.y, pos.z);
    },
    connectAudioNode: function(i) {
      this.webAudio.sources[i].connect(this.webAudio.gains[i]);
      this.webAudio.gains[i].connect(this.webAudio.analyzers[i]);
      this.webAudio.analyzers[i].connect(this.webAudio.panners[i]);
      this.webAudio.panners[i].connect(this.webAudio.masterGain);
      this.webAudio.masterGain.connect(this.webAudio.compressor);
      this.webAudio.compressor.connect(this.webAudio.audioContext.destination);
    },
    playSource: function(i) {
      const startTime =
        this.viewerData.spriteTimes[i].start + this.webAudio.currentTime;
      const endTime = this.viewerData.spriteTimes[i].end - startTime;
      this.webAudio.sources[i].start(0, startTime, endTime);
      this.webAudio.sources[i].loop = true;
    },
    pauseSource: function(i) {
      this.webAudio.sources[i].stop(0);
    },
    playPauseAll: function(isPlay) {
      if (isPlay) {
        for (const i in this.viewerData.positions) {
          this.playSource(i);
        }
      } else {
        for (const i in this.viewerData.positions) {
          this.pauseSource(i);

          // Re-generate buffer source nodes and connect
          this.createBufferSource(i);
          this.connectAudioNode(i);
        }
      }
    },
    calcForwardRewindTime: function(duration, webAudio, isForward, interval) {
      const pausedTime = webAudio.pausedTime;
      if (pausedTime.range.end) {
        pausedTime.total += pausedTime.range.end - pausedTime.range.start;
        pausedTime.range.start = null;
        pausedTime.range.end = null;
      }

      let dt;
      if (isForward) {
        dt = webAudio.currentTime + interval < duration ? interval : 0;
      } else {
        dt =
          webAudio.currentTime - interval > 0
            ? -interval
            : -webAudio.currentTime;
      }
      pausedTime.total -= dt;

      webAudio.currentTime =
        webAudio.audioContext.currentTime - pausedTime.total;
    },
    sparqlFetch: function(eventId) {
      sparqlAxios(
        this.axios,
        `${sparqlEndpointUrl}?query=${encodeURIComponent(
          viewerQuery(eventId)
        )}`,
        (response) => {
          const dataArray = response.data.results.bindings;
          this.viewerData = parseViewer(dataArray);
        },
        (error) => {
          console.error(error);
          this.viewerData = parseViewer([]);
        }
      );
    },
    loadAudio: function(audioFile) {
      audioAxios(
        this.axios,
        audioFile,
        (response) => {
          this.webAudio.audioContext.decodeAudioData(
            response.data,
            (buffer) => {
              this.webAudio.audioBuffer = buffer;
            }
          );
        },
        (error) => {
          console.error(error);
        }
      );
    },
    togglePlayPause: function() {
      this.mediaState.isPlaying = !this.mediaState.isPlaying;
      this.playPauseAll(this.mediaState.isPlaying);
    },
    forwardRewind: function(isForward, interval) {
      this.calcForwardRewindTime(
        this.viewerData.duration,
        this.webAudio,
        isForward,
        interval
      );
      this.mediaState.isForceSync = true;

      if (this.mediaState.isPlaying) {
        this.playPauseAll(false);
        this.playPauseAll(true);
      }
    },
    toggleMute: function(isMuted) {
      const gainValue = isMuted ? this.webAudio.maxVolume : 0;
      for (const gainNode of this.webAudio.gains) {
        gainNode.gain.value = gainValue;
      }

      /*
       * HACK: Gain node changes will not be observed
       *       unless this.webAudio.gains reference is changed
       */
      this.webAudio.gains = [...this.webAudio.gains];
    },
  },
  created: function() {
    this.createAudioContext();
    this.createMasterGain();
    this.createDynamicsCompressor();
    this.sparqlFetch(this.eventId);
  },
  destroyed: function() {
    if (this.mediaState.isPlaying) {
      this.mediaState.isPlaying = false;
      this.playPauseAll(this.mediaState.isPlaying);
    }
  },
  watch: {
    eventId: function(val) {
      this.sparqlFetch(val);
    },
    "viewerData.audioFile": function(val) {
      if (val.startsWith("http")) {
        this.loadAudio(val);
      }
    },
    "webAudio.audioBuffer": function(buf) {
      if (buf) {
        for (const [i, pos] of Object.entries(this.viewerData.positions)) {
          this.createBufferSource(i);
          this.createGain(i);
          this.createAnalyzer(i);
          this.createPanner(i, pos);
          this.connectAudioNode(i);
        }
        this.mediaState.isLoading.audio = false;
      }
    },
    "webAudio.currentTime": function() {
      this.mediaState.currentRate =
        this.webAudio.currentTime / this.viewerData.duration;
    },
  },
  components: {
    EventView,
  },
};
</script>
