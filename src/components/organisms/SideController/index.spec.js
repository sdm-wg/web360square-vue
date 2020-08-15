import { shallowMount } from "@vue/test-utils";
import SideController from ".";
import Logo from "@/components/atoms/Logo";
import PlaySVG from "@/components/molecules/PlaySVG";

describe("organisms/SideController", () => {
  let props;
  let stubs;

  beforeEach(() => {
    props = {
      mediaState: {
        isLoading: { audio: true, video: true },
        isPlaying: false,
      },
    };

    stubs = ["router-link"];
  });

  it("checks props", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
  });

  it("toggles `isPlaying` state when clicked PlaySVG", async () => {
    // Override props.mediaState.isLoading (audio and video are false)
    // Media data has been loaded
    props.mediaState.isLoading.audio = false;
    props.mediaState.isLoading.video = false;
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    // isPlaying: false -> true
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.props("mediaState").isPlaying).toBe(true);
    // isPlaying: true -> false
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.props("mediaState").isPlaying).toBe(false);
  });

  it("can not toggle `isPlaying` state if mediaState.isLoading is true", async () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    // Nothing happens
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isMediaLoading).toBe(true);
    expect(wrapper.props("mediaState").isPlaying).toBe(false);
  });

  it("has a PlaySVG component", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });

  it("has a Logo component", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.findComponent(Logo).exists()).toBe(true);
  });
});
