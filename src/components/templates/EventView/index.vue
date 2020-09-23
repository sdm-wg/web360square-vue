<template>
  <div class="w-screen h-screen flex bg-black">
    <AFrameViewer
      :viewerData="viewerData"
      :webAudio="webAudio"
      :mediaState="mediaState"
      :viewIndex="viewIndex"
    />
    <ViewSelector
      :videoList="viewerData.videoList"
      :viewIndex="viewIndex"
      @changeViewIndex="changeViewIndex"
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
import ViewSelector from "@/components/organisms/ViewSelector";

export default {
  name: "EventView",
  props: {
    viewerData: Object,
    webAudio: Object,
    mediaState: Object,
    viewIndex: Number,
  },
  methods: {
    changeViewIndex: function(index) {
      this.$emit("changeViewIndex", index);
    },
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
    ViewSelector,
  },
};
</script>
