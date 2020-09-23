import { shallowMount } from "@vue/test-utils";
import ViewSelector from ".";
import ViewSVG from "@/components/atoms/ViewSVG";
import CheckSVG from "@/components/atoms/CheckSVG";

describe("organisms/ViewSelector", () => {
  let props;

  beforeEach(() => {
    props = {
      videoList: [],
      viewIndex: -1,
    };
  });

  it("checks props", () => {
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });
    expect(wrapper.props("videoList")).toBe(props.videoList);
    expect(wrapper.props("viewIndex")).toBe(props.viewIndex);
  });

  it("checks currentViewName", async () => {
    props.videoList = [];
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });

    // empty videoList and invalid viewIndex
    expect(wrapper.vm.currentViewName).toBe("");

    const sourceN = Math.ceil(Math.random() * 10);
    const viewName = "viewName";
    const index = Math.floor(Math.random() * sourceN);
    wrapper.setProps({
      videoList: new Array(sourceN).fill({ viewName: viewName }),
      viewIndex: index,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.currentViewName).toBe(viewName);
  });

  it("checks activeViewId", async () => {
    props.videoList = [];
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });

    // empty videoList and invalid viewIndex
    expect(wrapper.vm.activeViewId).toBe("");

    const sourceN = Math.ceil(Math.random() * 10);
    const index = Math.floor(Math.random() * sourceN);
    wrapper.setProps({
      videoList: new Array(sourceN).fill({ viewName: "" }),
      viewIndex: index,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.activeViewId).toBe(`view-${index}`);
  });

  it("toggles isOpen between true and false when clicked button", async () => {
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });

    const isOpen = false;
    wrapper.setData({
      isOpen: isOpen,
    });
    await wrapper.vm.$nextTick();

    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    // false -> true
    expect(wrapper.vm.isOpen).toBe(!isOpen);

    wrapper.find("button").trigger("click");
    await wrapper.vm.$nextTick();
    // true -> false
    expect(wrapper.vm.isOpen).toBe(isOpen);
  });

  it("emits `changeViewIndex` when clicked list box item", async () => {
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });

    const isOpen = true;
    const sourceN = Math.ceil(Math.random() * 10);
    const index = Math.floor(Math.random() * sourceN);
    wrapper.setData({
      isOpen: isOpen,
    });
    wrapper.setProps({
      videoList: new Array(sourceN).fill({ viewName: "" }),
      viewIndex: index,
    });
    await wrapper.vm.$nextTick();

    wrapper.find(`#view-${index}`).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("changeViewIndex")).toBeTruthy();
    expect(wrapper.emitted("changeViewIndex")[0][0]).toBe(index);
    expect(wrapper.vm.isOpen).toBe(!isOpen);
  });

  it("has a ViewSVG component", () => {
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });
    expect(wrapper.findComponent(ViewSVG).exists()).toBe(true);
  });

  it("has CheckSVG components", async () => {
    props.videoList = [];
    const wrapper = shallowMount(ViewSelector, {
      propsData: props,
    });

    // empty videoList, invalid viewIndex, and is not open
    expect(wrapper.findAllComponents(CheckSVG).length).toBe(0);

    const isOpen = true;
    const sourceN = Math.ceil(Math.random() * 10);
    const index = Math.floor(Math.random() * sourceN);
    wrapper.setData({
      isOpen: isOpen,
    });
    wrapper.setProps({
      videoList: new Array(sourceN).fill({ viewName: "" }),
      viewIndex: index,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.findAllComponents(CheckSVG).length).toBe(sourceN);
  });
});
