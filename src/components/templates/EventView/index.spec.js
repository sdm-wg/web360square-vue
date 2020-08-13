import { shallowMount } from "@vue/test-utils";
import EventView from ".";
import AFrameViewer from "@/components/organisms/AFrameViewer";
import SideController from "@/components/organisms/SideController";
import { parseViewer } from "@/utils/sparql.js";

describe("templates/EventView", () => {
  let props;

  beforeEach(() => {
    props = {
      viewerData: parseViewer([]),
      webAudio: {
        audioContext: null,
        audioBuffer: null,
        masterGain: null,
        compressor: null,
        sources: [],
        gains: [],
        analyzers: [],
        panners: [],
      },
      mediaState: {
        isLoading: { audio: true, video: true },
        isPlaying: false,
      },
    };
  });

  it("checks props", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    expect(wrapper.props("viewerData")).toBe(props.viewerData);
    expect(wrapper.props("webAudio")).toBe(props.webAudio);
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
  });

  it("has an AFrameViewer component", () => {
    const wrapper = shallowMount(EventView);
    expect(wrapper.findComponent(AFrameViewer).exists()).toBe(true);
  });

  it("has a SideController component", () => {
    const wrapper = shallowMount(EventView);
    expect(wrapper.findComponent(SideController).exists()).toBe(true);
  });
});
