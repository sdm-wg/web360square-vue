import { shallowMount, mount } from "@vue/test-utils";
import CarouselSlider from ".";
import CarouselIndexButton from "@/components/atoms/CarouselIndexButton";
import CarouselNextPrevButton from "@/components/molecules/CarouselNextPrevButton";
import CarouselCard from "@/components/organisms/CarouselCard";
import CarouselErrorCard from "@/components/organisms/CarouselErrorCard";

describe("organisms/CarouselSlider", () => {
  it("checks CarouselSlider parts if `events.length === 0`", () => {
    const wrapper = shallowMount(CarouselSlider, {
      propsData: { events: [] },
    });
    expect(wrapper.findComponent(CarouselErrorCard).exists()).toBe(true);
  });

  it("checks CarouselSlider parts if `events.length > 0`", () => {
    const eventN = Math.ceil(Math.random() * 10);
    const events = new Array(eventN).fill({
      name: "",
      date: "",
      place: { name: "", address: "" },
    });
    const wrapper = shallowMount(CarouselSlider, {
      propsData: { events: events },
      stubs: ["router-link"],
    });
    expect(wrapper.findAllComponents(CarouselCard).length).toBe(eventN);
    expect(wrapper.findAllComponents(CarouselIndexButton).length).toBe(eventN);

    const carouselNextPrevButtons = wrapper.findAllComponents(
      CarouselNextPrevButton
    );
    expect(carouselNextPrevButtons.at(0).props("isNext")).toBe(false);
    expect(carouselNextPrevButtons.at(1).props("isNext")).toBe(true);
  });

  it("`activeIndex` is increased/decreased when clicking next/prev button", async () => {
    const eventN = 3;
    const events = new Array(eventN).fill({
      name: "",
      date: "",
      place: { name: "", address: "" },
    });
    const wrapper = mount(CarouselSlider, {
      propsData: { events: events },
      stubs: ["router-link"],
    });

    const carouselNextPrevButtons = wrapper.findAllComponents(
      CarouselNextPrevButton
    );
    const prevButton = carouselNextPrevButtons.at(0).find("button");
    const nextButton = carouselNextPrevButtons.at(1).find("button");
    let activeIndex;

    activeIndex = Math.floor(eventN / 2);
    wrapper.setData({ activeIndex: activeIndex });
    prevButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeIndex).toBe(activeIndex - 1);

    activeIndex = Math.floor(eventN / 2);
    wrapper.setData({ activeIndex: activeIndex });
    nextButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeIndex).toBe(activeIndex + 1);
  });

  it("`activeIndex` wraps around when clicking next/prev button", async () => {
    const eventN = 3;
    const events = new Array(eventN).fill({
      name: "",
      date: "",
      place: { name: "", address: "" },
    });
    const wrapper = mount(CarouselSlider, {
      propsData: { events: events },
      stubs: ["router-link"],
    });

    const carouselNextPrevButtons = wrapper.findAllComponents(
      CarouselNextPrevButton
    );
    const prevButton = carouselNextPrevButtons.at(0).find("button");
    const nextButton = carouselNextPrevButtons.at(1).find("button");
    let activeIndex;

    activeIndex = 0;
    wrapper.setData({ activeIndex: activeIndex });
    prevButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeIndex).toBe(eventN - 1);

    activeIndex = eventN - 1;
    wrapper.setData({ activeIndex: activeIndex });
    nextButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeIndex).toBe(0);
  });

  it("`activeIndex` equals to clicked button index", async () => {
    const eventN = Math.ceil(Math.random() * 10);
    const events = new Array(eventN).fill({
      name: "",
      date: "",
      place: { name: "", address: "" },
    });
    const wrapper = mount(CarouselSlider, {
      propsData: { events: events },
      stubs: ["router-link"],
    });

    const carouselIndexButtons = wrapper.findAllComponents(CarouselIndexButton);
    const index = Math.floor(Math.random() * eventN);
    const indexButton = carouselIndexButtons.at(index);

    indexButton.trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.activeIndex).toBe(index);
  });
});
