<template>
  <div class="relative">
    <div class="w-48 m-4 absolute right-0">
      <div class="relative">
        <button
          type="button"
          aria-haspopup="listbox"
          aria-expanded="true"
          aria-labelledby="listbox-label"
          class="cursor-pointer select-none relative w-full border border-gray-300 bg-black bg-opacity-25 text-gray-100 leading-6 overflow-auto py-1 pl-2 text-center focus:outline-none z-9999"
          @click="toggleMenu"
        >
          <div class="flex items-center">
            <span class="flex items-center">
              <ViewSVG class="h-5 w-5" />
            </span>
            <span class="block truncate w-full mx-2 font-semibold">{{
              currentViewName
            }}</span>
          </div>
        </button>

        <transition name="viewmenu" mode="out-in">
          <div v-if="isOpen" class="absolute mt-1 w-full bg-white text-black">
            <ul
              tabindex="-1"
              role="listbox"
              aria-labelledby="listbox-label"
              :aria-activedescendant="activeViewId"
              class="max-h-56 py-1 text-base leading-6 overflow-auto focus:outline-none z-9999"
            >
              <li
                v-for="(video, index) in videoList"
                :key="index"
                :id="`view-${index}`"
                role="option"
                class="cursor-pointer select-none relative py-2 pl-2"
                :class="{ 'text-orange-500': index === viewIndex }"
                @click="changeViewIndex(index)"
              >
                <div class="flex items-center">
                  <span class="flex items-center">
                    <CheckSVG class="h-5 w-5" :selected="index === viewIndex" />
                  </span>

                  <span
                    class="block truncate w-full mx-2"
                    :class="{
                      'font-semibold': index === viewIndex,
                      'font-normal': index !== viewIndex,
                    }"
                    >{{ video.viewName }}</span
                  >
                </div>
              </li>
            </ul>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script>
import ViewSVG from "@/components/atoms/ViewSVG";
import CheckSVG from "@/components/atoms/CheckSVG";

export default {
  name: "ViewSelector",
  data: () => {
    return {
      isOpen: false,
    };
  },
  props: {
    videoList: Array,
    viewIndex: Number,
  },
  computed: {
    currentViewName: function() {
      if (this.viewIndex < 0 || this.videoList.length <= this.viewIndex) {
        return "";
      }
      return this.videoList[this.viewIndex].viewName;
    },
    activeViewId: function() {
      if (this.viewIndex < 0 || this.videoList.length <= this.viewIndex) {
        return "";
      }
      return `view-${this.viewIndex}`;
    },
  },
  methods: {
    toggleMenu: function() {
      this.isOpen = !this.isOpen;
    },
    changeViewIndex: function(index) {
      this.$emit("changeViewIndex", index);
      this.toggleMenu();
    },
  },
  components: {
    ViewSVG,
    CheckSVG,
  },
};
</script>

<style>
.viewmenu-enter-active,
.viewmenu-leave-active {
  transition: opacity 0.3s;
}
.viewmenu-enter,
.viewmenu-leave-to {
  opacity: 0;
}
</style>
