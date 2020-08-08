import { shallowMount } from "@vue/test-utils";
import AFrameCamera from ".";

describe("molecules/AFrameCamera", () => {
  let props;
  let stubs;

  beforeEach(() => {
    props = { audioContext: null };
    stubs = ["a-entity"];
  });

  it("checks props", () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("audioContext")).toBe(props.audioContext);
  });

  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameCamera, {
      stubs: stubs,
    });
    // Hack
    expect(wrapper.findAll("a-entity-stub").length).toBe(1);
  });
});
