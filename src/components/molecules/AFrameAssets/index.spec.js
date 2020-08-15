import { shallowMount, mount } from "@vue/test-utils";
import AFrameAssets from ".";
import * as video from "@/utils/video.js";

describe("molecules/AFrameAssets", () => {
  // Video element mock variables
  let videoElementPlay;
  let videoElementPause;

  // Props mock variables
  let props;

  // Stub variables
  let stubs;

  beforeEach(() => {
    // `document.getElementById` mock
    videoElementPlay = jest.fn();
    videoElementPause = jest.fn();
    jest.spyOn(document, "getElementById").mockImplementation(() => {
      return {
        play: videoElementPlay,
        pause: videoElementPause,
      };
    });

    // `@/utils/video.js` mock
    video.setupHls = jest.fn();
    video.looseSync = jest.fn();
    video.forceSync = jest.fn();
    video.calcBufferedRates = jest.fn();

    // `console.warn` mock
    jest.spyOn(console, "warn").mockImplementation(() => {});

    // Props mock
    props = {
      playlistFile: null,
      currentTime: 0,
      mediaState: {
        isLoading: { audio: true, video: true },
        isPlaying: false,
      },
    };

    // Stubs
    stubs = ["a-assets"];
  });

  afterEach(() => {
    jest.clearAllMocks();

    // Restore `document.getElementById`
    document.getElementById.mockRestore();

    // Restore `console.warn`
    console.warn.mockRestore();
  });

  it("checks props", () => {
    const wrapper = shallowMount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("playlistFile")).toBe(props.playlistFile);
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
  });

  it("checks whether getVideoElement will be called on the mounted hook", async () => {
    shallowMount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });
    expect(document.getElementById).toHaveBeenCalledTimes(1);
  });

  it("checks playlistFile watcher", async () => {
    const wrapper = shallowMount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });
    // Invalid playlist file
    const invalidPlaylistFile = "";
    wrapper.setProps({ playlistFile: invalidPlaylistFile });
    await wrapper.vm.$nextTick();
    expect(video.setupHls).toHaveBeenCalledTimes(0);

    // Valid playlist file
    const validPlaylistFile = "http://playlistFile";
    wrapper.setProps({ playlistFile: validPlaylistFile });
    await wrapper.vm.$nextTick();
    expect(video.setupHls).toHaveBeenCalledTimes(1);
  });

  it("checks currentTime watcher", async () => {
    const wrapper = shallowMount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });
    // Created
    expect(video.looseSync).toHaveBeenCalledTimes(0);
    expect(video.forceSync).toHaveBeenCalledTimes(0);
    expect(video.calcBufferedRates).toHaveBeenCalledTimes(0);

    let currentTime;
    currentTime = 1.0;
    wrapper.setProps({ currentTime: currentTime });
    await wrapper.vm.$nextTick();

    // Update current time (No loop happend)
    expect(video.looseSync).toHaveBeenCalledTimes(1);
    expect(video.forceSync).toHaveBeenCalledTimes(0);
    expect(video.calcBufferedRates).toHaveBeenCalledTimes(1);

    currentTime = 0;
    wrapper.setProps({ currentTime: currentTime });
    await wrapper.vm.$nextTick();

    // Update current time (loop happend)
    expect(video.looseSync).toHaveBeenCalledTimes(1);
    expect(video.forceSync).toHaveBeenCalledTimes(1);
    expect(video.calcBufferedRates).toHaveBeenCalledTimes(2);
  });

  it("checks mediaState.isPlaying watcher", async () => {
    const wrapper = mount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });

    let isPlaying;

    // Play
    wrapper.setData({ videoElement: { paused: true } });
    isPlaying = true;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(videoElementPlay).toHaveBeenCalledTimes(1);

    // Pause
    wrapper.setData({ videoElement: { paused: false } });
    isPlaying = false;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(videoElementPause).toHaveBeenCalledTimes(1);

    // paused: false & isPlaying: true (Nothing happens)
    wrapper.setData({ videoElement: { paused: false } });
    isPlaying = true;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(videoElementPlay).toHaveBeenCalledTimes(1);
    expect(videoElementPause).toHaveBeenCalledTimes(1);

    // paused: true & isPlaying: false (Nothing happens)
    wrapper.setData({ videoElement: { paused: true } });
    isPlaying = false;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();
    expect(videoElementPlay).toHaveBeenCalledTimes(1);
    expect(videoElementPause).toHaveBeenCalledTimes(1);
  });

  it("checks mediaState.isPlaying watcher if VideoElement isn't ready", async () => {
    const wrapper = mount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.setData({ videoElement: null });
    await wrapper.vm.$nextTick();

    // Nothing happens if VideoElement isn't ready
    expect(console.warn).toHaveBeenCalledTimes(0);

    let isPlaying;
    isPlaying = true;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();

    // watch:mediaState.isPlaying (false -> true)
    expect(console.warn).toHaveBeenCalledTimes(1);

    isPlaying = false;
    wrapper.setProps({ mediaState: { isPlaying: isPlaying } });
    await wrapper.vm.$nextTick();

    // watch:mediaState.isPlaying (true -> false)
    expect(console.warn).toHaveBeenCalledTimes(2);
  });

  it("has an `a-assets`", () => {
    const wrapper = shallowMount(AFrameAssets, {
      propsData: props,
      stubs: stubs,
    });
    // HACK: find stub elements
    expect(wrapper.find("a-assets-stub").exists()).toBe(true);
  });
});
