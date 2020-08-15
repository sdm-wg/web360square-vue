<template>
  <a-scene
    cursor="rayOrigin: mouse"
    raycaster="objects: .clickable"
    vr-mode-ui="enabled: false"
    loading-screen="dotsColor: white; backgroundColor: black"
  >
    <AFrameAssets
      :playlistFile="viewerData.playlistFile"
      :duration="viewerData.duration"
      :currentTime="webAudio.currentTime"
      :mediaState="mediaState"
    />
    <AFrameCamera
      :duration="viewerData.duration"
      :webAudio="webAudio"
      :mediaState="mediaState"
      :eyeLevel="eyeLevel"
    />
    <AFrameVideoSphere />
    <AFrameAudioVisualizer
      v-for="(position, index) in viewerData.positions"
      :key="index"
      :index="index"
      :position="position"
      :webAudio="webAudio"
      :mediaState="mediaState"
      :eyeLevel="eyeLevel"
    />
  </a-scene>
</template>

<script>
import AFrameVideoSphere from "@/components/atoms/AFrameVideoSphere";
import AFrameAssets from "@/components/molecules/AFrameAssets";
import AFrameCamera from "@/components/molecules/AFrameCamera";
import AFrameAudioVisualizer from "@/components/molecules/AFrameAudioVisualizer";

export default {
  name: "AFrameViewer",
  props: {
    viewerData: Object,
    webAudio: Object,
    mediaState: Object,
    eyeLevel: Number,
  },
  components: {
    AFrameAudioVisualizer,
    AFrameVideoSphere,
    AFrameAssets,
    AFrameCamera,
  },
};
</script>
