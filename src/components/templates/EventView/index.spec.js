import { shallowMount } from "@vue/test-utils";
import EventView from ".";
import AFrameViewer from "@/components/organisms/AFrameViewer";
import SideController from "@/components/organisms/SideController";

describe("templates/EventView", () => {
  it("has an AFrameViewer component", () => {
    const wrapper = shallowMount(EventView);
    expect(wrapper.findComponent(AFrameViewer).exists()).toBe(true);
  });

  it("has a SideController component", () => {
    const wrapper = shallowMount(EventView);
    expect(wrapper.findComponent(SideController).exists()).toBe(true);
  });
});
