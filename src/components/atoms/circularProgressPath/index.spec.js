import { shallowMount } from "@vue/test-utils";
import circularProgressPath from ".";

describe("atoms/circularProgressPath", () => {
  // Props mock variables
  let props;

  beforeEach(() => {
    // Props mock
    props = {
      progressRate: { start: 0, end: 0.5 },
      center: 12,
      radius: 10,
    };
  });

  it("checks whether full circle or not", async () => {
    const wrapper = shallowMount(circularProgressPath, {
      propsData: props,
    });
    wrapper.setProps({ progressRate: { start: 0, end: 1 } });
    await wrapper.vm.$nextTick();

    // is full circle
    expect(wrapper.find("circle").exists()).toBe(true);

    wrapper.setProps({ progressRate: { start: 0.1, end: 0.9 } });
    await wrapper.vm.$nextTick();

    // is not full circle
    expect(wrapper.find("path").exists()).toBe(true);
  });

  it("checks path data", async () => {
    const wrapper = shallowMount(circularProgressPath, {
      propsData: props,
    });
    const pathStartWith = `M12 2A10 10 0`;
    let largeArcFlag;

    wrapper.setProps({ progressRate: { start: 0, end: 0.49 } });
    await wrapper.vm.$nextTick();

    // largeArcFlag is 0
    largeArcFlag = 0;
    expect(wrapper.find("path").attributes("d")).toContain(
      `${pathStartWith} ${largeArcFlag}`
    );

    wrapper.setProps({ progressRate: { start: 0, end: 0.5 } });
    await wrapper.vm.$nextTick();

    // largeArcFlag is 1
    largeArcFlag = 1;
    expect(wrapper.find("path").attributes("d")).toContain(
      `${pathStartWith} ${largeArcFlag}`
    );
  });
});
