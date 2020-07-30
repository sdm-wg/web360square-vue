import { shallowMount } from "@vue/test-utils";
import { toBeVisible } from "@testing-library/jest-dom/matchers";
import CarouselCard from "./";

expect.extend({ toBeVisible });

describe("organisms/CarouselCard", () => {
  it("toggles CarouselCard between show and hide", async () => {
    const wrapper = shallowMount(CarouselCard);
    wrapper.setProps({ isActive: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.element).toBeVisible();

    wrapper.setProps({ isActive: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.element).not.toBeVisible();
  });
});
