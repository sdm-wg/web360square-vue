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
    };
  },
  props: {
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
      }
    },
  },
};
</script>
