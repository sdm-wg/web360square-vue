import { shallowMount } from "@vue/test-utils";
import EventView from ".";
import AFrameViewer from "@/components/organisms/AFrameViewer";
import ViewSelector from "@/components/organisms/ViewSelector";
import SideController from "@/components/organisms/SideController";
import { parseViewer } from "@/utils/sparql.js";

describe("templates/EventView", () => {
  let props;

  beforeEach(() => {
    props = {
      viewerData: parseViewer([]),
      webAudio: {},
      mediaState: {},
      viewIndex: null,
    };
  });

  it("checks props", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    expect(wrapper.props("viewerData")).toBe(props.viewerData);
    expect(wrapper.props("webAudio")).toBe(props.webAudio);
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
    expect(wrapper.props("viewIndex")).toBe(props.viewIndex);
  });

  it("emits changeViewIndex", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    const index = Math.floor(Math.random() * 10);
    wrapper.vm.changeViewIndex(index);
    expect(wrapper.emitted("changeViewIndex")).toBeTruthy();
    expect(wrapper.emitted("changeViewIndex")[0][0]).toBe(index);
  });

  it("emits togglePlayPause", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    wrapper.vm.togglePlayPause();
    expect(wrapper.emitted("togglePlayPause")).toBeTruthy();
  });

  it("emits forwardRewind", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    const isForward = true;
    const interval = 10;
    wrapper.vm.forwardRewind(isForward, interval);
    expect(wrapper.emitted("forwardRewind")).toBeTruthy();
    expect(wrapper.emitted("forwardRewind")[0][0]).toBe(isForward);
    expect(wrapper.emitted("forwardRewind")[0][1]).toBe(interval);
  });

  it("emits toggleMute", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    const isMuted = true;
    wrapper.vm.toggleMute(isMuted);
    expect(wrapper.emitted("toggleMute")).toBeTruthy();
    expect(wrapper.emitted("toggleMute")[0][0]).toBe(isMuted);
  });

  it("has an AFrameViewer component", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    expect(wrapper.findComponent(AFrameViewer).exists()).toBe(true);
  });

  it("has a ViewSelector component", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    expect(wrapper.findComponent(ViewSelector).exists()).toBe(true);
  });

  it("has a SideController component", () => {
    const wrapper = shallowMount(EventView, {
      propsData: props,
    });
    expect(wrapper.findComponent(SideController).exists()).toBe(true);
  });
});
