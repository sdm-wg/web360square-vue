import { shallowMount } from "@vue/test-utils";
import AFrameViewer from ".";
import { parseViewer } from "@/utils/sparql.js";

describe("organisms/AFrameViewer", () => {
  it("has an `a-scene`", () => {
    const viewerData = parseViewer([]);
    const wrapper = shallowMount(AFrameViewer, {
      propsData: { viewerData: viewerData },
      stubs: ["a-scene"],
    });
    // Hack
    expect(wrapper.find("a-scene-stub").exists()).toBe(true);
  });

  it("checks props.viewerData", () => {
    const viewerData = parseViewer([]);
    const wrapper = shallowMount(AFrameViewer, {
      propsData: { viewerData: viewerData },
      stubs: ["a-scene"],
    });
    expect(wrapper.props("viewerData")).toBe(viewerData);
  });
});
