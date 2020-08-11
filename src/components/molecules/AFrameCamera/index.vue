<template>
  <a-entity listener camera look-controls position="0 1.6 0"> </a-entity>
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
        range: { start: 0, end: 0 },
      },
    };
  },
  props: {
    duration: Number,
    webAudio: Object,
    mediaState: Object,
  },
  methods: {
    initListenerOrientation: function() {
      const position = new AFRAME.THREE.Vector3().setFromMatrixPosition(
        this.listener.element.object3D.matrixWorld
      );
      this.webAudio.audioContext.listener.setPosition(
        position.x,
        position.y,
        position.z
      );
    },
    updateListenerOrientation: function() {
      const orientationMatrix = this.listener.element.object3D.matrixWorld
        .clone()
        .setPosition(0, 0, 0);

      const frontVector = new AFRAME.THREE.Vector3(0, 0, 1);
      frontVector.applyMatrix4(orientationMatrix);
      frontVector.normalize();

      const upVector = new AFRAME.THREE.Vector3(0, -1, 0);
      upVector.applyMatrix4(orientationMatrix);
      upVector.normalize();

      this.webAudio.audioContext.listener.setOrientation(
        frontVector.x,
        frontVector.y,
        frontVector.z,
        upVector.x,
        upVector.y,
        upVector.z
      );
    },
    updateCurrentTime: function() {
      if (this.mediaState.isPlaying) {
        if (this.pausedTime.range.end) {
          // Add paused time when resuming playback
          this.pausedTime.total +=
            this.pausedTime.range.end - this.pausedTime.range.start;
          this.pausedTime.range.start = 0;
          this.pausedTime.range.end = 0;
        }

        // Calculate current time
        this.webAudio.currentTime =
          this.webAudio.audioContext.currentTime - this.pausedTime.total;

        if (this.webAudio.currentTime > this.duration) {
          // Wrap around currentTime when looping
          this.webAudio.currentTime -= this.duration;
          this.pausedTime.total += this.duration;
        }
      } else {
        // Update paused duration
        this.pausedTime.range.start =
          this.pausedTime.range.start || this.webAudio.audioContext.currentTime;
        this.pausedTime.range.end = this.webAudio.audioContext.currentTime;
      }
    },
  },
  created: function() {
    // HACK: re-reference `listener`
    this.listener = listener;
  },
  watch: {
    "listener.tickSignal": function() {
      if (this.listener.initReady) {
        this.initListenerOrientation();
        this.listener.initReady = false;
      } else {
        this.updateListenerOrientation();
        this.updateCurrentTime();
      }
    },
  },
};
</script>
