import { shallowMount } from "@vue/test-utils";
import CarouselIndexButton from ".";

describe("atoms/CarouselIndexButton", () => {
  it("`bg` class of div element is changed by props.isActive", async () => {
    const wrapper = shallowMount(CarouselIndexButton);
    wrapper.setProps({ isActive: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain("bg-orange-400");

    wrapper.setProps({ isActive: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain("bg-orange-200");
  });
});
