import { shallowMount } from "@vue/test-utils";
import AFrameCamera from ".";

describe("molecules/AFrameCamera", () => {
  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameCamera, {
      stubs: ["a-entity"],
    });
    // Hack
    expect(wrapper.findAll("a-entity-stub").length).toBe(2);
  });
});
