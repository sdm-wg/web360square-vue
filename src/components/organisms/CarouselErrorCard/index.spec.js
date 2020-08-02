import { shallowMount } from "@vue/test-utils";
import CarouselErrorCard from ".";

describe("organisms/CarouselErrorCard", () => {
  it("has a svg and message", () => {
    const wrapper = shallowMount(CarouselErrorCard);
    expect(wrapper.find("svg").exists()).toBe(true);
    expect(wrapper.find("span").text()).toBe("Event data not found");
  });
});
