import { shallowMount } from "@vue/test-utils";
import CarouselCardEventName from ".";

describe("molecules/CarouselCardEventName", () => {
  it("checks props.name", () => {
    // Generate a random string
    const name = Math.random()
      .toString(36)
      .substring(2, 15);
    const wrapper = shallowMount(CarouselCardEventName, {
      propsData: { name: name },
    });
    expect(wrapper.props("name")).toBe(name);
  });
});
