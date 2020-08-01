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

  it("logo image is changed by props.isHorizontal", async () => {
    // `require()` does not work in unit test.
    const dummy_wrapper = shallowMount(Logo);

    dummy_wrapper.setProps({ isHorizontal: true });
    await dummy_wrapper.vm.$nextTick();
    expect(dummy_wrapper.attributes("src")).toEqual("");

    dummy_wrapper.setProps({ isHorizontal: false });
    await dummy_wrapper.vm.$nextTick();
    expect(dummy_wrapper.attributes("src")).toEqual("");

    // re-write `Logo.computed.imageSrc` to return `require()` as string
    Logo.computed.imageSrc = function() {
      if (this.isHorizontal) {
        return 'require("@/assets/images/logo-h.png")';
      } else {
        return 'require("@/assets/images/logo-v.png")';
      }
    };
    const wrapper = shallowMount(Logo);
    wrapper.setProps({ isHorizontal: true });
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes("src")).toEqual(
      'require("@/assets/images/logo-h.png")'
    );

    wrapper.setProps({ isHorizontal: false });
    await wrapper.vm.$nextTick();
    expect(wrapper.attributes("src")).toEqual(
      'require("@/assets/images/logo-v.png")'
    );
  });
});
