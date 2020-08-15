<template>
  <a-entity listener camera look-controls :position="position" />
</template>

<script>
import AFRAME from "aframe";
import { listener } from "@/utils/aframe/listener";

export default {
  name: "AFrameCamera",
  data: () => {
    return {
      listener: listener,
      pausedTime: {
        total: 0,
        range: { start: 0, end: null },
      },
    };
  },
  props: {
    duration: Number,
    webAudio: Object,
    mediaState: Object,
    eyeLevel: Number,
  },
  methods: {
    initListenerOrientation: function(element, webAudio) {
      if (!element.object3D) {
        return;
      }

      const position = new AFRAME.THREE.Vector3().setFromMatrixPosition(
        element.object3D.matrixWorld
      );
      webAudio.audioContext.listener.setPosition(
        position.x,
        position.y,
        position.z
      );
    },
    updateListenerOrientation: function(element, webAudio) {
      if (!element.object3D) {
        return;
      }

      const orientationMatrix = element.object3D.matrixWorld
        .clone()
        .setPosition(0, 0, 0);

      const frontVector = new AFRAME.THREE.Vector3(0, 0, -1);
      frontVector.applyMatrix4(orientationMatrix);
      frontVector.normalize();

      const upVector = new AFRAME.THREE.Vector3(0, 1, 0);
      upVector.applyMatrix4(orientationMatrix);
      upVector.normalize();

      webAudio.audioContext.listener.setOrientation(
        frontVector.x,
        frontVector.y,
        frontVector.z,
        upVector.x,
        upVector.y,
        upVector.z
      );
    },
    updateCurrentTime: function(pausedTime, duration, webAudio, mediaState) {
      if (mediaState.isPlaying) {
        if (pausedTime.range.end) {
          // Add paused time when resuming playback
          pausedTime.total += pausedTime.range.end - pausedTime.range.start;
        }

        // Calculate current time
        webAudio.currentTime =
          webAudio.audioContext.currentTime - pausedTime.total;

        if (webAudio.currentTime > duration) {
          // Wrap around currentTime when looping
          webAudio.currentTime -= duration;
          pausedTime.total += duration;
        }

        pausedTime.range.start = null;
        pausedTime.range.end = null;
      } else {
        // Update paused duration
        if (pausedTime.range.start === null) {
          pausedTime.range.start = webAudio.audioContext.currentTime;
        }
        pausedTime.range.end = webAudio.audioContext.currentTime;
      }
    },
  },
  computed: {
    position: function() {
      return `0 ${this.eyeLevel} 0`;
    },
  },
  created: function() {
    // HACK: re-reference `listener`
    this.listener = listener;
  },
  watch: {
    "listener.tickSignal": function() {
      if (this.listener.initReady) {
        this.initListenerOrientation(this.$el, this.webAudio);
        this.listener.initReady = false;
      } else {
        this.updateListenerOrientation(this.$el, this.webAudio);
        this.updateCurrentTime(
          this.pausedTime,
          this.duration,
          this.webAudio,
          this.mediaState
        );
      }
    },
  },
};
</script>
