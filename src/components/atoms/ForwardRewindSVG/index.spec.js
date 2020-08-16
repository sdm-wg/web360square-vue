import { shallowMount } from "@vue/test-utils";
import ForwardRewindSVG from ".";

describe("atoms/ForwardRewindSVG", () => {
  // Props mock variables
  let props;

  beforeEach(() => {
    // Props mock
    props = {
      width: 100,
      isForward: true,
      interval: 10,
    };
  });

  it("svg width is equal to props.width", () => {
    const max = 9900;
    const min = 100;
    const width = Math.floor(Math.random() * (max + 1 - min)) + min;
    props.width = width;
    const wrapper = shallowMount(ForwardRewindSVG, {
      propsData: props,
    });
    expect(wrapper.attributes("width")).toEqual(width.toString());
  });

  it("svg path is changed by props.isForward", async () => {
    const wrapper = shallowMount(ForwardRewindSVG, {
      propsData: props,
    });
    const pathD = {
      forward:
        "M12 2.5a9.5 9.5 0 1 0 9.5 9.5h-1a8.5 8.5 0 1 1-8.5-8.5v-1M12 0v6l3-3-3-3zm3 0v6l3-3-3-3",
      rewind:
        "M12 2.5a9.5 9.5 0 1 1 -9.5 9.5h1a8.5 8.5 0 1 0 8.5-8.5v-1M12 0v6l-3-3 3-3zm-3 0v6l-3-3 3-3",
    };

    wrapper.setProps({ isForward: true });
    await wrapper.vm.$nextTick();
    // forward
    expect(wrapper.find("path").attributes("d")).toBe(pathD.forward);

    wrapper.setProps({ isForward: false });
    await wrapper.vm.$nextTick();
    // rewind
    expect(wrapper.find("path").attributes("d")).toBe(pathD.rewind);
  });

  it("svg text is changed by props.interval", async () => {
    const wrapper = shallowMount(ForwardRewindSVG, {
      propsData: props,
    });
    expect(wrapper.find("text").text()).toBe(props.interval.toString());
  });
});
