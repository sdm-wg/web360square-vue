import { createLocalVue, shallowMount } from "@vue/test-utils";
import axios from "axios";
import Home from ".";

jest.useFakeTimers();
jest.mock("axios");

const localVue = createLocalVue();
localVue.prototype.axios = axios;

describe("pages/Home", () => {
  it("has a created hook", () => {
    expect(typeof Home.created).toBe("function");
  });

  it("checks data changes over time on Axios success handling", async () => {
    // Axios mock
    const eventN = Math.ceil(Math.random() * 10);
    const response = {
      data: {
        results: {
          bindings: new Array(eventN).fill({
            event: { value: "" },
            eventName: { value: "" },
            eventDate: { value: "" },
            eventPlaceName: { value: "" },
            eventPlaceAddress: { value: "" },
          }),
        },
      },
    };
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve(response);
    });

    const wrapper = shallowMount(Home, {
      localVue,
    });
    // First View
    expect(wrapper.vm.isFirstView).toBe(true);
    expect(wrapper.vm.events.length).toBe(0);

    await wrapper.vm.$nextTick();

    // Axios
    expect(wrapper.vm.events.length).toBe(eventN);

    jest.runAllTimers();

    // Main View
    expect(wrapper.vm.isFirstView).toBe(false);
  });

  it("checks data changes over time on Axios error handling", async () => {
    // Axios mock
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve(new Error("error test"));
    });

    // `console.error` mock
    console.error = jest.fn();

    const wrapper = shallowMount(Home, {
      localVue,
    });
    // First View
    expect(wrapper.vm.isFirstView).toBe(true);
    expect(wrapper.vm.events.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // Axios
    expect(wrapper.vm.events.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);

    jest.runAllTimers();

    // Main View
    expect(wrapper.vm.isFirstView).toBe(false);
  });
});
