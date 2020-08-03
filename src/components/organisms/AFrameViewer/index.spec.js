import { shallowMount } from "@vue/test-utils";
import AFrameViewer from ".";

describe("organisms/AFrameViewer", () => {
  it("has an `a-scene`", () => {
    const wrapper = shallowMount(AFrameViewer, {
      stubs: ["a-scene"],
    });
    // Hack
    expect(wrapper.find("a-scene-stub").exists()).toBe(true);
  });

  it("checks props.viewerData", () => {
    const viewerData = {
      duration: 0,
      playlistFile: "",
      audioFile: "",
      positions: [],
      spriteTimes: [],
    };
    const wrapper = shallowMount(AFrameViewer, {
      propsData: { viewerData: viewerData },
      stubs: ["a-scene"],
    });
    expect(wrapper.props("viewerData")).toBe(viewerData);
  });
});
