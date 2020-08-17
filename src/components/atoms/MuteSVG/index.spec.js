import { shallowMount } from "@vue/test-utils";
import MuteSVG from ".";

describe("atoms/MuteSVG", () => {
  // Props mock variables
  let props;

  beforeEach(() => {
    // Props mock
    props = {
      width: 100,
      isMute: true,
    };
  });

  it("svg width is equal to props.width", () => {
    const max = 9900;
    const min = 100;
    const width = Math.floor(Math.random() * (max + 1 - min)) + min;
    props.width = width;
    const wrapper = shallowMount(MuteSVG, {
      propsData: props,
    });
    expect(wrapper.attributes("width")).toEqual(width.toString());
  });

  it("svg path is changed by props.isMute", async () => {
    const wrapper = shallowMount(MuteSVG, {
      propsData: props,
    });
    const pathD = {
      mute:
        "M14 9.5l1-1 2.5 2.5 2.5-2.5 1 1-2.5 2.5 2.5 2.5-1 1-2.5-2.5-2.5 2.5-1-1 2.5-2.5-2.5-2.5z",
      unmute: "M14 9a3 3 0 0 1 0 6m0 3a6 6 0 0 0 0 -12v-2a8 8 0 0 1 0 16v-2z",
    };

    wrapper.setProps({ isMute: true });
    await wrapper.vm.$nextTick();
    // mute
    expect(
      wrapper
        .findAll("path")
        .at(1)
        .attributes("d")
    ).toBe(pathD.mute);

    wrapper.setProps({ isMute: false });
    await wrapper.vm.$nextTick();
    // unmute
    expect(
      wrapper
        .findAll("path")
        .at(1)
        .attributes("d")
    ).toBe(pathD.unmute);
  });
});
