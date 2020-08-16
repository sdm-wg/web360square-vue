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
    updateCurrentTime: function(duration, webAudio, mediaState) {
      if (mediaState.isPlaying) {
        if (webAudio.pausedTime.range.end) {
          // Add paused time when resuming playback
          webAudio.pausedTime.total +=
            webAudio.pausedTime.range.end - webAudio.pausedTime.range.start;
        }

        // Calculate current time
        webAudio.currentTime =
          webAudio.audioContext.currentTime - webAudio.pausedTime.total;

        if (webAudio.currentTime > duration) {
          // Wrap around currentTime when looping
          webAudio.currentTime -= duration;
          webAudio.pausedTime.total += duration;
        }

        webAudio.pausedTime.range.start = null;
        webAudio.pausedTime.range.end = null;
      } else {
        // Update paused duration
        if (webAudio.pausedTime.range.start === null) {
          webAudio.pausedTime.range.start = webAudio.audioContext.currentTime;
        }
        webAudio.pausedTime.range.end = webAudio.audioContext.currentTime;
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
        this.updateCurrentTime(this.duration, this.webAudio, this.mediaState);
      }
    },
  },
};
</script>
