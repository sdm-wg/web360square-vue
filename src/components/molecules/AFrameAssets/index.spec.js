import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import AFrameAssets from ".";
import * as video from "@/utils/video.js";

const localVue = createLocalVue();
localVue.use(Vuex);

describe("molecules/AFrameAssets", () => {
  let store;
  beforeEach(() => {
    store = new Vuex.Store({
      state: {
        isPlaying: false,
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

  it("checks watch", async () => {
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
});
