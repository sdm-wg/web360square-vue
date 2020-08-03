import { shallowMount } from "@vue/test-utils";
import SideController from ".";
import PlaySVG from "@/components/atoms/PlaySVG";
import Logo from "@/components/atoms/Logo";

describe("organisms/SideController", () => {
  it("has a PlaySVG component", () => {
    const wrapper = shallowMount(SideController, {
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });

  it("has a Logo component", () => {
    const wrapper = shallowMount(SideController, {
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(Logo).exists()).toBe(true);
  });
});
