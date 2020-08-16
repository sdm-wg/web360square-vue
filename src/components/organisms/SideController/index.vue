<template>
  <nav
    class="h-full flex justify-center items-center bg-black bg-opacity-25 text-gray-100 z-9999"
  >
    <ul>
      <li class="hover:bg-gray-700 hover:bg-opacity-75">
        <a
          @click.prevent="forwardRewind(false, 10)"
          href="#"
          class="w-16 h-16 p-4 flex"
        >
          <ForwardRewindSVG
            class="w-full text-white"
            :isForward="false"
            :interval="10"
          />
        </a>
      </li>
      <li class="hover:bg-gray-700 hover:bg-opacity-75">
        <a @click.prevent="togglePlayPause" href="#" class="w-16 h-16 p-4 flex">
          <PlaySVG
            class="w-full text-white"
            :isLoading="isMediaLoading"
            :isPlay="!mediaState.isPlaying"
            :currentRate="mediaState.currentRate"
            :bufferedRates="mediaState.bufferedRates"
          />
        </a>
      </li>
      <li class="hover:bg-gray-700 hover:bg-opacity-75">
        <a
          @click.prevent="forwardRewind(true, 10)"
          href="#"
          class="w-16 h-16 p-4 flex"
        >
          <ForwardRewindSVG
            class="w-full text-white"
            :isForward="true"
            :interval="10"
          />
        </a>
      </li>
      <li class="hover:bg-gray-700 hover:bg-opacity-75">
        <router-link to="/" class="w-16 h-16 p-4 flex">
          <Logo class="w-full" :isHorizontal="false" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import Logo from "@/components/atoms/Logo";
import ForwardRewindSVG from "@/components/atoms/ForwardRewindSVG";
import PlaySVG from "@/components/molecules/PlaySVG";

export default {
  name: "sideController",
  props: {
    mediaState: Object,
  },
  methods: {
    togglePlayPause: function() {
      if (!this.isMediaLoading) {
        this.$emit("togglePlayPause");
      }
    },
    forwardRewind: function(isForward, interval) {
      if (!this.isMediaLoading) {
        this.$emit("forwardRewind", isForward, interval);
      }
    },
  },
  computed: {
    isMediaLoading: function() {
      return this.mediaState.isLoading.audio || this.mediaState.isLoading.video;
    },
  },
  components: {
    Logo,
    ForwardRewindSVG,
    PlaySVG,
  },
};
</script>
