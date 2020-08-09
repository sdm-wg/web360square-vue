import { shallowMount } from "@vue/test-utils";
import SideController from ".";
import PlaySVG from "@/components/atoms/PlaySVG";
import Logo from "@/components/atoms/Logo";

describe("organisms/SideController", () => {
  let props;
  let stubs;

  beforeEach(() => {
    props = {
      mediaState: {
        isLoading: false,
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
