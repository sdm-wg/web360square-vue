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
});
