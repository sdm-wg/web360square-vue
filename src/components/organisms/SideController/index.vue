<template>
  <nav
    class="h-full flex justify-center items-center bg-black bg-opacity-25 text-gray-100 z-9999"
  >
    <ul>
      <li class="hover:bg-gray-700">
        <a @click.prevent="" href="#" class="w-16 h-16 p-4 flex">
          <PlaySVG class="w-full text-white" :isPlay="true" />
        </a>
      </li>
      <li class="hover:bg-gray-700">
        <router-link to="/" class="w-16 h-16 p-4 flex">
          <Logo class="w-full" :isHorizontal="false" />
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import PlaySVG from "@/components/atoms/PlaySVG";
import Logo from "@/components/atoms/Logo";

export default {
  name: "sideController",
  components: {
    PlaySVG,
    Logo,
  },
};
</script>
