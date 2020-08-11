<template>
  <a-scene
    vr-mode-ui="enabled: false"
    loading-screen="dotsColor: white; backgroundColor: black"
  >
    <AFrameAssets
      :playlistFile="viewerData.playlistFile"
      :currentTime="webAudio.currentTime"
      :mediaState="mediaState"
    />
    <AFrameCamera
      :duration="viewerData.duration"
      :webAudio="webAudio"
      :mediaState="mediaState"
    />
    <AFrameVideoSphere />
    <AFrameAudioVisualizer
      v-for="(position, audioVisualizerIndex) in viewerData.positions"
      :key="audioVisualizerIndex"
      :position="position"
    />
  </a-scene>
</template>

<script>
import AFrameAudioVisualizer from "@/components/atoms/AFrameAudioVisualizer";
import AFrameVideoSphere from "@/components/atoms/AFrameVideoSphere";
import AFrameAssets from "@/components/molecules/AFrameAssets";
import AFrameCamera from "@/components/molecules/AFrameCamera";

export default {
  name: "AFrameViewer",
  props: {
    viewerData: Object,
    webAudio: Object,
    mediaState: Object,
  },
  components: {
    AFrameAudioVisualizer,
    AFrameVideoSphere,
    AFrameAssets,
    AFrameCamera,
  },
};
</script>
