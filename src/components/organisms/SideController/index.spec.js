import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import SideController from ".";
import PlaySVG from "@/components/atoms/PlaySVG";
import Logo from "@/components/atoms/Logo";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("organisms/SideController", () => {
  let store;
  beforeEach(() => {
    const state = {
      isPlaying: false,
    };

    const getters = {
      getIsPlaying: (state) => {
        return state.isPlaying;
      },
    };

    const mutations = {
      setIsPlaying(state, bool) {
        state.isPlaying = bool;
      },
    };

    store = new Vuex.Store({
      modules: {
        event: {
          namespaced: true,
          state,
          getters,
          mutations,
        },
      },
    });
  });

  it("has a PlaySVG component", () => {
    const wrapper = shallowMount(SideController, {
      store,
      localVue,
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });

  it("has a Logo component", () => {
    const wrapper = shallowMount(SideController, {
      store,
      localVue,
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(Logo).exists()).toBe(true);
  });

  it("toggles `isPlaying` state when clicked PlaySVG", async () => {
    const wrapper = shallowMount(SideController, {
      store,
      localVue,
      stubs: ["router-link"],
    });
    // isPlaying: false -> true
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isPlaying).toBe(true);
    // isPlaying: true -> false
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isPlaying).toBe(false);
  });
});
