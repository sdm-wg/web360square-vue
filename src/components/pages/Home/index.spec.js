import { shallowMount } from "@vue/test-utils";
import Home from "./";

jest.useFakeTimers();

describe("pages/Home", () => {
  it("has a created hook", () => {
    expect(typeof Home.created).toBe("function");
  });

  it("`isFirstView` changes from true to false over time", () => {
    const wrapper = shallowMount(Home);
    wrapper.setData({ isFirstView: true });
    // First View
    expect(wrapper.vm.isFirstView).toBe(true);

    jest.runAllTimers();

    // Main View
    expect(wrapper.vm.isFirstView).toBe(false);
  });
});
