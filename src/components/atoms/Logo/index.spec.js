import { shallowMount } from "@vue/test-utils";
import Logo from "./";

describe("atoms/Logo", () => {
  it("logo width is equal to props.width", () => {
    const max = 9900;
    const min = 100;
    const width = Math.floor(Math.random() * (max + 1 - min)) + min;
    const wrapper = shallowMount(Logo, {
      propsData: { width: width },
    });
    expect(wrapper.attributes("width")).toEqual(width.toString());
  });
});
