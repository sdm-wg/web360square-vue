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
      webAudio: {},
      mediaState: {},
      eyeLevel: null,
    };
  });

  it("checks props", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    expect(wrapper.props("viewerData")).toBe(props.viewerData);
    expect(wrapper.props("webAudio")).toBe(props.webAudio);
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
    expect(wrapper.props("eyeLevel")).toBe(props.eyeLevel);
  });

  it("emits togglePlayPause", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    wrapper.vm.togglePlayPause();
    expect(wrapper.emitted("togglePlayPause")).toBeTruthy();
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
