import { shallowMount } from "@vue/test-utils";
import AFrameAudioVisualizer from ".";
import * as audioVisualizer from "@/utils/aframe/audioVisualizer";

describe("molecules/AFrameAudioVisualizer", () => {
  // AnalyserNode mock variables
  let analyzerGetByteFrequencyData;

  // Props mock variables
  let props;

  // Stub variables
  let stubs;

  beforeEach(() => {
    // AnalyserNode mock
    analyzerGetByteFrequencyData = jest.fn();

    // `@/utils/aframe/audioVisualizer` mock
    audioVisualizer.calcHeight = jest.fn();
    audioVisualizer.calcColor = jest.fn();

    // Props mock
    props = {
      index: 0,
      position: {},
      webAudio: {
        analyzers: [
          {
            frequencyBinCount: 1024,
            getByteFrequencyData: analyzerGetByteFrequencyData,
          },
        ],
        gains: [
          {
            gain: {
              value: 1,
            },
          },
        ],
        maxVolume: 1,
        validFrequencyBand: { min: null, max: null },
      },
      mediaState: { isPlaying: false },
    };

    // Stubs
    stubs = ["a-entity"];
  });

  it("can not toggle gain (because webAudio.gains[index] is not defined)", async () => {
    props.webAudio.gains = [];
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.vm.toggleGain();
    await wrapper.vm.$nextTick();

    // Nothing happens
  });

  it("toggles gain", async () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    // Created
    expect(wrapper.props("webAudio").gains[0].gain.value).toBe(
      wrapper.props("webAudio").maxVolume
    );

    wrapper.vm.toggleGain();
    await wrapper.vm.$nextTick();

    // Gain: ON -> OFF
    expect(wrapper.props("webAudio").gains[0].gain.value).toBe(0);

    wrapper.vm.toggleGain();
    await wrapper.vm.$nextTick();

    // Gain: OFF -> ON
    expect(wrapper.props("webAudio").gains[0].gain.value).toBe(
      wrapper.props("webAudio").maxVolume
    );
  });

  it("checks registeredAudioVisualizer.num", async () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.setData({
      audioVisualizer: null,
      registeredAudioVisualizer: { num: 1 },
      spectrums: [],
    });
    await wrapper.vm.$nextTick();

    // watch:registeredAudioVisualizer.num
    expect(wrapper.vm.audioVisualizer).not.toBe(null);
  });

  it("checks audioVisualizer.tickSignal when audioVisualizer.initReady is true", async () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.setData({
      audioVisualizer: {
        initReady: true,
        tickSignal: true,
      },
      registeredAudioVisualizer: { num: 1 },
      spectrums: [],
    });
    await wrapper.vm.$nextTick();

    // watch:audioVisualizer.tickSignal
    // audioVisualizer.initReady: true -> false
    expect(wrapper.vm.audioVisualizer.initReady).toBe(false);
  });

  it("checks audioVisualizer.tickSignal when webAudio.analyzers[index] is undefined", async () => {
    props.webAudio.analyzers = [];
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.setData({
      audioVisualizer: {
        initReady: false,
        tickSignal: true,
      },
      registeredAudioVisualizer: { num: 1 },
      spectrums: [],
    });
    await wrapper.vm.$nextTick();

    // watch:audioVisualizer.tickSignal (audioVisualizer.initReady is false)
    // Nothing happens
  });

  it("checks audioVisualizer.tickSignal when webAudio.analyzers[index] has been defined", async () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    const spectrumN = 32;
    const spectrum = {
      vector: {},
      width: 0.15,
      height: 0.1,
      color: "gray",
    };
    wrapper.setData({
      audioVisualizer: {
        initReady: false,
        tickSignal: true,
      },
      registeredAudioVisualizer: { num: 1 },
      spectrums: new Array(spectrumN).fill(spectrum),
    });
    await wrapper.vm.$nextTick();

    // watch:audioVisualizer.tickSignal (audioVisualizer.initReady is false)
    // mediaState.isPlaying is false
    expect(audioVisualizer.calcHeight).toHaveBeenCalledTimes(0);
    expect(audioVisualizer.calcColor).toHaveBeenCalledTimes(0);

    wrapper.setProps({ mediaState: { isPlaying: true } });
    wrapper.setData({
      audioVisualizer: {
        initReady: false,
        tickSignal: false,
      },
      registeredAudioVisualizer: { num: 1 },
      spectrums: new Array(spectrumN).fill(spectrum),
    });
    await wrapper.vm.$nextTick();

    // watch:audioVisualizer.tickSignal (audioVisualizer.initReady is false)
    // mediaState.isPlaying is true
    expect(audioVisualizer.calcHeight).toHaveBeenCalledTimes(spectrumN);
    expect(audioVisualizer.calcColor).toHaveBeenCalledTimes(spectrumN);
  });

  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    // HACK: find stub elements
    expect(wrapper.find("a-entity-stub").exists()).toBe(true);
  });
});
