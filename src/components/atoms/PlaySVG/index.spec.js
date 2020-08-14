import { shallowMount } from "@vue/test-utils";
import PlaySVG from ".";

describe("atoms/PlaySVG", () => {
  it("svg width is equal to props.width", () => {
    const max = 9900;
    const min = 100;
    const width = Math.floor(Math.random() * (max + 1 - min)) + min;
    const wrapper = shallowMount(PlaySVG, {
      propsData: { width: width },
    });
    expect(wrapper.attributes("width")).toEqual(width.toString());
  });

  it("svg is changed by props.isLoading and props.isPlaying", async () => {
    const pathD = {
      loading: "M12 3a9 9 0 1 0 9 9h-2a7 7 0 1 1-7-7v-2",
      play: "M7 18v-12l13 6-13 6z",
      pause: "M10.5 7h-2v10h2v-10zM13.5 7h2v10h-2v-10z",
    };
    const wrapper = shallowMount(PlaySVG);
    wrapper.setProps({ isLoading: true, isPlay: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("path").attributes("d")).toBe(pathD.loading);
    wrapper.setProps({ isLoading: false, isPlay: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("path").attributes("d")).toBe(pathD.play);
    wrapper.setProps({ isLoading: false, isPlay: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.find("path").attributes("d")).toBe(pathD.pause);
  });
});
