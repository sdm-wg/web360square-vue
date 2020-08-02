import { shallowMount } from "@vue/test-utils";
import HomeView from ".";
import Logo from "@/components/atoms/Logo";
import CarouselSlider from "@/components/organisms/CarouselSlider";

describe("templates/HomeView", () => {
  it("checks HomeView parts", async () => {
    const wrapper = shallowMount(HomeView, {
      propsData: {
        isFirstView: true,
        logos: {
          firstView: { isHorizontal: false },
          mainView: { isHorizontal: true },
        },
      },
    });
    // First View
    expect(wrapper.findComponent(Logo).props("isHorizontal")).toBe(false);
    expect(wrapper.findComponent(CarouselSlider).exists()).toBe(false);

    wrapper.setProps({ isFirstView: false });
    await wrapper.vm.$nextTick();

    // Main View
    expect(wrapper.findComponent(Logo).props("isHorizontal")).toBe(true);
    expect(wrapper.findComponent(CarouselSlider).exists()).toBe(true);
  });
});
