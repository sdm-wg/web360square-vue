import { shallowMount } from "@vue/test-utils";
import AFrameViewer from ".";
import { parseViewer } from "@/utils/sparql.js";

describe("organisms/AFrameViewer", () => {
  let props;
  let stubs;

  beforeEach(() => {
    props = {
      viewerData: parseViewer([]),
      webAudio: {},
      mediaState: {},
      viewIndex: null,
    };

    stubs = ["a-scene"];
  });

  it("checks props", () => {
    const wrapper = shallowMount(AFrameViewer, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("viewerData")).toBe(props.viewerData);
    expect(wrapper.props("webAudio")).toBe(props.webAudio);
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
    expect(wrapper.props("viewIndex")).toBe(props.viewIndex);
  });

  it("has an `a-scene`", () => {
    const wrapper = shallowMount(AFrameViewer, {
      propsData: props,
      stubs: stubs,
    });
    // Hack
    expect(wrapper.find("a-scene-stub").exists()).toBe(true);
  });
});
