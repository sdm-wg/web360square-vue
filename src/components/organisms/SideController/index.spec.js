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
    store = new Vuex.Store({
      state: {
        isPlaying: false,
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
});
