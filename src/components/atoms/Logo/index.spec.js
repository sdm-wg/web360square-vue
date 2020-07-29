import { shallowMount } from "@vue/test-utils";
import Logo from "./";

describe("atoms/Logo", () => {
  it("logo width is equal to props.width", () => {
    const width = 240;
    const wrapper = shallowMount(Logo, {
      propsData: { width: width },
    });
    expect(wrapper.attributes("width")).toEqual(width.toString());
  });
});
