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
        gains: [],
      },
    };

    // Stubs
    stubs = ["a-entity"];
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
