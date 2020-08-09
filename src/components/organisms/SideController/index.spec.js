import { shallowMount } from "@vue/test-utils";
import SideController from ".";
import PlaySVG from "@/components/atoms/PlaySVG";
import Logo from "@/components/atoms/Logo";

describe("organisms/SideController", () => {
  it("has a PlaySVG component", () => {
    const props = { mediaState: { isPlaying: false } };
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });

  it("has a Logo component", () => {
    const props = { mediaState: { isPlaying: false } };
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(Logo).exists()).toBe(true);
  });

  it("toggles `isPlaying` state when clicked PlaySVG", async () => {
    const props = { mediaState: { isPlaying: false } };
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: ["router-link"],
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
});
