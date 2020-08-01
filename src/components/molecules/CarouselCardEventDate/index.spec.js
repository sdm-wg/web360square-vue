import { shallowMount } from "@vue/test-utils";
import CarouselCardEventDate from ".";

describe("molecules/CarouselCardEventDate", () => {
  it("checks props.date", () => {
    // Generate a random string
    const date = Math.random()
      .toString(36)
      .substring(2, 15);
    const wrapper = shallowMount(CarouselCardEventDate, {
      propsData: { date: date },
    });
    expect(wrapper.props("date")).toBe(date);
  });
});
