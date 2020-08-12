import { shallowMount } from "@vue/test-utils";
import AFrameAudioVisualizer from ".";

describe("molecules/AFrameAudioVisualizer", () => {
  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameAudioVisualizer, {
      stubs: ["a-entity"],
    });
    // Hack
    expect(wrapper.find("a-entity-stub").exists()).toBe(true);
  });
});
