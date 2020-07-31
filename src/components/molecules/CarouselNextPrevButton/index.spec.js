import { shallowMount } from "@vue/test-utils";
import CarouselNextPrevButton from ".";

describe("molecules/CarouselNextPrevButton", () => {
  it("`justify` class of div element is changed by props.isNext", async () => {
    const wrapper = shallowMount(CarouselNextPrevButton);
    wrapper.setProps({ isNext: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain("justify-end");

    wrapper.setProps({ isNext: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.classes()).toContain("justify-start");
  });

  it("`margin` class of button element is changed by props.isNext", async () => {
    const wrapper = shallowMount(CarouselNextPrevButton);
    wrapper.setProps({ isNext: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").classes()).toContain("-mr-8");

    wrapper.setProps({ isNext: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").classes()).toContain("-ml-8");
  });

  it("value of button element is changed by props.isNext", async () => {
    const wrapper = shallowMount(CarouselNextPrevButton);
    wrapper.setProps({ isNext: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").text()).toBe(">");

    wrapper.setProps({ isNext: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("button").text()).toBe("<");
  });

  it("`next`/`prev` is emitted when clicking next/prev button", async () => {
    const nextWrapper = shallowMount(CarouselNextPrevButton, {
      propsData: { isNext: true },
    });
    nextWrapper.find("button").trigger("click");
    await nextWrapper.vm.$nextTick();
    expect(nextWrapper.emitted("next")).toBeTruthy();

    const prevWrapper = shallowMount(CarouselNextPrevButton, {
      propsData: { isNext: false },
    });
    prevWrapper.find("button").trigger("click");
    await prevWrapper.vm.$nextTick();
    expect(prevWrapper.emitted("prev")).toBeTruthy();
  });
});
