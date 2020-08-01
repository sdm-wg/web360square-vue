import { shallowMount } from "@vue/test-utils";
import { toBeVisible } from "@testing-library/jest-dom/matchers";
import CarouselCard from ".";
import PlaySVG from "@/components/atoms/PlaySVG";
import CarouselCardEventName from "@/components/molecules/CarouselCardEventName";

expect.extend({ toBeVisible });

describe("organisms/CarouselCard", () => {
  it("toggles CarouselCard between show and hide", async () => {
    const event = {
      name: "",
      date: "",
      place: { name: "", address: "" },
    };
    const wrapper = shallowMount(CarouselCard, {
      propsData: { event: event },
      stubs: ["router-link"],
    });
    wrapper.setProps({ isActive: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toBeVisible();

    wrapper.setProps({ isActive: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.element).not.toBeVisible();
  });

  it("has a PlaySVG component", () => {
    const event = {
      name: "",
      date: "",
      place: { name: "", address: "" },
    };
    const wrapper = shallowMount(CarouselCard, {
      propsData: { event: event },
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });

  it("has a CarouselCardEventName component", () => {
    const event = {
      name: "",
      date: "",
      place: { name: "", address: "" },
    };
    const wrapper = shallowMount(CarouselCard, {
      propsData: { event: event },
      stubs: ["router-link"],
    });
    expect(wrapper.findComponent(CarouselCardEventName).exists()).toBe(true);
  });
});
