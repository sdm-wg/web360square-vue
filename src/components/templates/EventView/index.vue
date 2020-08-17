<template>
  <div class="w-screen h-screen flex bg-black">
    <AFrameViewer
      :viewerData="viewerData"
      :webAudio="webAudio"
      :mediaState="mediaState"
      :eyeLevel="eyeLevel"
    />
    <SideController
      :webAudio="webAudio"
      :mediaState="mediaState"
      @togglePlayPause="togglePlayPause"
      @forwardRewind="forwardRewind"
      @toggleMute="toggleMute"
    />
  </div>
</template>

<script>
import AFrameViewer from "@/components/organisms/AFrameViewer";
import SideController from "@/components/organisms/SideController";

export default {
  name: "EventView",
  props: {
    viewerData: Object,
    webAudio: Object,
    mediaState: Object,
    eyeLevel: Number,
  },
  methods: {
    togglePlayPause: function() {
      this.$emit("togglePlayPause");
    },
    forwardRewind: function(isForward, interval) {
      this.$emit("forwardRewind", isForward, interval);
    },
    toggleMute: function(isMuted) {
      this.$emit("toggleMute", isMuted);
    },
  },
  components: {
    AFrameViewer,
    SideController,
  },
};
</script>
