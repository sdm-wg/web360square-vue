<template>
  <a-scene
    cursor="rayOrigin: mouse"
    raycaster="objects: .clickable"
    vr-mode-ui="enabled: false"
    loading-screen="dotsColor: white; backgroundColor: black"
  >
    <AFrameAssets
      :playlistFile="playlistFile"
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
      v-for="(position, index) in convertedAudioPositions"
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
    viewIndex: Number,
  },
  computed: {
    playlistFile: function() {
      if (
        this.viewIndex < 0 ||
        this.viewerData.videoList.length <= this.viewIndex
      ) {
        return "";
      }
      return this.viewerData.videoList[this.viewIndex].playlistFile;
    },
    eyeLevel: function() {
      if (
        this.viewIndex < 0 ||
        this.viewerData.videoList.length <= this.viewIndex
      ) {
        return 0;
      }
      return this.viewerData.videoList[this.viewIndex].position.y;
    },
    convertedAudioPositions: function() {
      return this.viewerData.audioList.map((audio) => audio.convertedPosition);
    },
  },
  components: {
    AFrameAudioVisualizer,
    AFrameVideoSphere,
    AFrameAssets,
    AFrameCamera,
  },
};
</script>
