import { createLocalVue, shallowMount, mount } from "@vue/test-utils";
import Vuex from "vuex";
import AFrameAssets from ".";
import * as video from "@/utils/video.js";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("molecules/AFrameAssets", () => {
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

  it("has an `a-assets`", () => {
    const wrapper = shallowMount(AFrameAssets, {
      store,
      localVue,
      stubs: ["a-assets"],
    });
    // Hack
    expect(wrapper.find("a-assets-stub").exists()).toBe(true);
  });

  it("checks whether getVideoElement will be called on the mounted hook", async () => {
    // Methods mock
    const methods = {
      getVideoElement: jest.fn(),
    };
    shallowMount(AFrameAssets, {
      methods,
      store,
      localVue,
      stubs: ["a-assets"],
    });
    expect(methods.getVideoElement).toHaveBeenCalledTimes(1);
  });

  it("checks watching `playlistFile`", async () => {
    // setupHls mock
    video.setupHls = jest.fn();

    const invalidPlaylistFile = "";
    const validPlaylistFile = "http://playlistFile";

    const wrapper = shallowMount(AFrameAssets, {
      store,
      localVue,
      stubs: ["a-assets"],
    });
    wrapper.setProps({ playlistFile: invalidPlaylistFile });
    await wrapper.vm.$nextTick();
    expect(video.setupHls).toHaveBeenCalledTimes(0);

    wrapper.setProps({ playlistFile: validPlaylistFile });
    await wrapper.vm.$nextTick();
    expect(video.setupHls).toHaveBeenCalledTimes(1);
  });

  it("checks watching `isPlaying`", async () => {
    // `console.warn` mock
    console.warn = jest.fn();

    const wrapper = mount(AFrameAssets, {
      store,
      localVue,
      stubs: ["a-assets"],
    });
    // Nothing happens if VideoElement doesn't have a valid value
    expect(console.warn).toHaveBeenCalledTimes(0);
    wrapper.vm.$store.commit("event/setIsPlaying", true);
    await wrapper.vm.$nextTick();
    expect(console.warn).toHaveBeenCalledTimes(1);
    wrapper.vm.$store.commit("event/setIsPlaying", false);
    await wrapper.vm.$nextTick();
    expect(console.warn).toHaveBeenCalledTimes(2);

    // VideoElement Mock
    const play = jest.fn();
    const pause = jest.fn();
    wrapper.setData({
      videoElement: {
        play: play,
        pause: pause,
      },
    });

    // Play
    wrapper.setData({ videoElement: { paused: true } });
    wrapper.vm.$store.commit("event/setIsPlaying", true);
    await wrapper.vm.$nextTick();
    expect(play).toHaveBeenCalledTimes(1);

    // Pause
    wrapper.setData({ videoElement: { paused: false } });
    wrapper.vm.$store.commit("event/setIsPlaying", false);
    await wrapper.vm.$nextTick();
    expect(pause).toHaveBeenCalledTimes(1);

    // paused: false & isPlaying: true (Nothing happens)
    wrapper.setData({ videoElement: { paused: false } });
    wrapper.vm.$store.commit("event/setIsPlaying", true);
    await wrapper.vm.$nextTick();
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);

    // paused: true & isPlaying: false (Nothing happens)
    wrapper.setData({ videoElement: { paused: true } });
    wrapper.vm.$store.commit("event/setIsPlaying", false);
    await wrapper.vm.$nextTick();
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
  });
});
