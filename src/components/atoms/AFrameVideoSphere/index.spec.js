import { shallowMount } from "@vue/test-utils";
import AFrameVideoSphere from ".";

describe("atoms/AFrameVideoSphere", () => {
  it("has an `a-videosphere`", () => {
    const wrapper = shallowMount(AFrameVideoSphere, {
      stubs: ["a-videosphere"],
    });
    // Hack
    expect(wrapper.find("a-videosphere-stub").exists()).toBe(true);
  });
});
