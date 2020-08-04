<template>
  <div class="w-screen h-screen flex bg-black">
    <AFrameViewer :viewerData="viewerData" />
    <SideController />
  </div>
</template>

<script>
import AFrameViewer from "@/components/organisms/AFrameViewer";
import SideController from "@/components/organisms/SideController";

export default {
  name: "EventView",
  props: {
    viewerData: Object,
  },
  components: {
    AFrameViewer,
    SideController,
  },
};
</script>
