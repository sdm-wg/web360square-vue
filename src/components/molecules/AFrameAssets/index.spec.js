import { shallowMount, mount } from "@vue/test-utils";
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

  it("checks watching `playlistFile`", async () => {
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

  it("checks watching `isPlaying`", async () => {
    // `console.warn` mock
    console.warn = jest.fn();

    let isPlaying = false;
    const wrapper = mount(AFrameAssets, {
      propsData: { mediaState: { isPlaying: isPlaying } },
      stubs: ["a-assets"],
    });
    // Nothing happens if VideoElement doesn't have a valid value
    expect(console.warn).toHaveBeenCalledTimes(0);
    isPlaying = true;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(console.warn).toHaveBeenCalledTimes(1);
    isPlaying = false;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
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
    isPlaying = true;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(play).toHaveBeenCalledTimes(1);

    // Pause
    wrapper.setData({ videoElement: { paused: false } });
    isPlaying = false;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(pause).toHaveBeenCalledTimes(1);

    // paused: false & isPlaying: true (Nothing happens)
    wrapper.setData({ videoElement: { paused: false } });
    isPlaying = true;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);

    // paused: true & isPlaying: false (Nothing happens)
    wrapper.setData({ videoElement: { paused: true } });
    isPlaying = false;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(play).toHaveBeenCalledTimes(1);
    expect(pause).toHaveBeenCalledTimes(1);
  });
});
