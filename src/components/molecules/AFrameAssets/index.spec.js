import { shallowMount } from "@vue/test-utils";
import AFrameAssets from ".";
import * as video from "@/utils/video.js";

describe("molecules/AFrameAssets", () => {
  it("has an `a-assets`", () => {
    const wrapper = shallowMount(AFrameAssets, {
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
