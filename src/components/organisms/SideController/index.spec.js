import { shallowMount } from "@vue/test-utils";
import SideController from ".";
import PlaySVG from "@/components/atoms/PlaySVG";

describe("organisms/SideController", () => {
  it("has a PlaySVG component", () => {
    const wrapper = shallowMount(SideController);
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });
});
