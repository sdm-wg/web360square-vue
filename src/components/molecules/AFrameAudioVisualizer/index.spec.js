import { shallowMount } from "@vue/test-utils";
import AFrameAudioVisualizer from ".";

describe("molecules/AFrameAudioVisualizer", () => {
  // Props mock variables
  let props;

  // Stub variables
  let stubs;

  beforeEach(() => {
    // Props mock
    props = {
      index: 0,
      position: {},
      webAudio: {
        gains: [
          {
            gain: {
              value: 1,
            },
          },
        ],
        maxVolume: 1,
      },
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

  it("checks audioVisualizer.tickSignal", async () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.setData({
      audioVisualizer: { tickSignal: true },
      registeredAudioVisualizer: { num: 1 },
      spectrums: [],
    });
    await wrapper.vm.$nextTick();

    // watch:audioVisualizer.tickSignal
    // (WIP)
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
