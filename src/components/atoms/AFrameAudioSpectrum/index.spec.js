import { shallowMount } from "@vue/test-utils";
import AFrameAudioSpectrum from ".";

describe("atoms/AFrameAudioSpectrum", () => {
  // Vector mock variables
  let vectorMultiplyScalar;
  let vectorClone;

  // Props mock variables
  let props;

  // Stub variables
  let stubs;

  beforeEach(() => {
    // Vector mock
    vectorMultiplyScalar = jest.fn();
    vectorClone = jest.fn().mockImplementation(() => {
      return { multiplyScalar: vectorMultiplyScalar };
    }); // Use chained function like `.clone().multiplyScalar()`

    // Props mock
    props = {
      spectrumVector: {
        clone: vectorClone,
      },
      width: 0.15,
      height: 0.1,
      color: "gray",
      visible: true,
    };

    // Stubs
    stubs = ["a-entity"];
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("checks initQuaternion", () => {
    const setFromUnitVectors = jest.fn();
    const element = {};
    const spectrumVector = [];

    // element.object3D is undefined
    AFrameAudioSpectrum.methods.initQuaternion(element, spectrumVector);
    expect(setFromUnitVectors).toHaveBeenCalledTimes(0);

    element.object3D = {
      quaternion: {
        setFromUnitVectors: setFromUnitVectors,
      },
      up: [],
    };

    // element.object3D has been defined
    AFrameAudioSpectrum.methods.initQuaternion(element, spectrumVector);
    expect(setFromUnitVectors).toHaveBeenCalledTimes(1);
  });

  it("checks visible watcher", async () => {
    const visible = true;

    props.visible = visible;

    const wrapper = shallowMount(AFrameAudioSpectrum, {
      propsData: props,
      stubs: stubs,
    });

    // after mounted
    expect(wrapper.vm.$el.getAttribute("visible")).toBe(visible.toString());

    wrapper.setProps({ visible: !visible });
    await wrapper.vm.$nextTick();

    // visible has changed
    expect(wrapper.vm.$el.getAttribute("visible")).toBe((!visible).toString());
  });

  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameAudioSpectrum, {
      propsData: props,
      stubs: stubs,
    });
    // HACK: find stub elements
    expect(wrapper.find("a-entity-stub").exists()).toBe(true);
  });
});
