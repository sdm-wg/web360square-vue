import { shallowMount } from "@vue/test-utils";
import CarouselCardEventPlace from ".";

describe("molecules/CarouselCardEventPlace", () => {
  it("checks props.place", () => {
    // Generate a random string
    const place = {
      name: Math.random()
        .toString(36)
        .substring(2, 15),
      address: Math.random()
        .toString(36)
        .substring(2, 15),
    };
    const wrapper = shallowMount(CarouselCardEventPlace, {
      propsData: { place: place },
    });
    expect(wrapper.props("place").name).toBe(place.name);
    expect(wrapper.props("place").address).toBe(place.address);
  });
});
