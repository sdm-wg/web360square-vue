import { shallowMount } from "@vue/test-utils";
import CarouselSlider from ".";
import CarouselIndexButton from "@/components/atoms/CarouselIndexButton";
import CarouselNextPrevButton from "@/components/molecules/CarouselNextPrevButton";
import CarouselCard from "@/components/organisms/CarouselCard";

describe("organisms/CarouselSlider", () => {
  it("checks CarouselSlider parts", () => {
    const eventN = Math.ceil(Math.random() * 10);
    const events = new Array(eventN);
    const wrapper = shallowMount(CarouselSlider, {
      propsData: { events: events },
    });
    expect(wrapper.findAllComponents(CarouselCard).length).toBe(eventN);
    expect(wrapper.findAllComponents(CarouselIndexButton).length).toBe(eventN);

    const carouselNextPrevButtons = wrapper.findAllComponents(
      CarouselNextPrevButton
    );
    expect(carouselNextPrevButtons.at(0).props("isNext")).toBe(false);
    expect(carouselNextPrevButtons.at(1).props("isNext")).toBe(true);
  });
});
