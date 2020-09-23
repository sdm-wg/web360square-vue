import { shallowMount } from "@vue/test-utils";
import CheckSVG from ".";

describe("atoms/CheckSVG", () => {
  // Props mock variables
  let props;

  beforeEach(() => {
    // Props mock
    props = {
      width: 100,
      selected: true,
    };
  });

  it("svg width is equal to props.width", () => {
    const max = 9900;
    const min = 100;
    const width = Math.floor(Math.random() * (max + 1 - min)) + min;
    props.width = width;
    const wrapper = shallowMount(CheckSVG, {
      propsData: props,
    });
    expect(wrapper.attributes("width")).toEqual(width.toString());
  });

  it("svg path exists if props.selected is true", async () => {
    const wrapper = shallowMount(CheckSVG, {
      propsData: props,
    });

    wrapper.setProps({ selected: true });
    await wrapper.vm.$nextTick();
    // selected
    expect(wrapper.vm.$el.querySelector("path").style.display).toBe("");

    wrapper.setProps({ selected: false });
    await wrapper.vm.$nextTick();
    // unselected
    expect(wrapper.vm.$el.querySelector("path").style.display).toBe("none");
  });
});
