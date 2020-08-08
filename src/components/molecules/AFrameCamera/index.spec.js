import { shallowMount } from "@vue/test-utils";
import AFrameCamera from ".";
import AFRAME from "aframe";

describe("molecules/AFrameCamera", () => {
  // AudioContext mock
  let listenerSetPosition;
  let listenerSetOrientation;

  // AFRAME.THREE.Vector3 mock variables
  let vector3SetFromMatrixPosition;
  let vector3ApplyMatrix4;
  let vector3Normalize;

  // Data mock variables
  let element;
  let matrixWorldClone;
  let matrixWorldSetPosition;

  // Props mock variables
  let props;

  // Stub variables
  let stubs;

  beforeEach(() => {
    // AudioContext mock
    listenerSetPosition = jest.fn();
    listenerSetOrientation = jest.fn();
    window.AudioContext = jest.fn().mockImplementation(() => {
      return {
        listener: {
          setPosition: listenerSetPosition,
          setOrientation: listenerSetOrientation,
        },
      };
    });

    // AFRAME.THREE.Vector3 mock
    vector3SetFromMatrixPosition = jest.fn().mockImplementation(() => {
      return { x: 0, y: 0, z: 0 };
    });
    vector3ApplyMatrix4 = jest.fn();
    vector3Normalize = jest.fn();

    AFRAME.THREE.Vector3 = jest.fn().mockImplementation(() => {
      return {
        setFromMatrixPosition: vector3SetFromMatrixPosition,
        applyMatrix4: vector3ApplyMatrix4,
        normalize: vector3Normalize,
      };
    });

    // Data mock
    matrixWorldSetPosition = jest.fn();
    matrixWorldClone = jest.fn().mockImplementation(() => {
      return { setPosition: matrixWorldSetPosition };
    }); // Use chained function like `.clone().setPosition()`
    element = {
      object3D: {
        matrixWorld: {
          clone: matrixWorldClone,
        },
      },
    };

    // Props mock
    props = {
      audioContext: new window.AudioContext(),
    };

    // Stubs
    stubs = ["a-entity"];
  });

  afterEach(() => {
    jest.clearAllMocks();

    // Reset AudioContext mock
    window.AudioContext = undefined;
  });

  it("checks props", () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("audioContext")).toBe(props.audioContext);
  });

  it("checks listener.tickSignal watcher", async () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });

    // After created
    expect(vector3SetFromMatrixPosition).toHaveBeenCalledTimes(0);
    expect(listenerSetPosition).toHaveBeenCalledTimes(0);
    expect(matrixWorldClone).toHaveBeenCalledTimes(0);
    expect(matrixWorldSetPosition).toHaveBeenCalledTimes(0);
    expect(vector3ApplyMatrix4).toHaveBeenCalledTimes(0);
    expect(vector3Normalize).toHaveBeenCalledTimes(0);
    expect(listenerSetOrientation).toHaveBeenCalledTimes(0);

    wrapper.setData({
      listener: {
        initReady: true,
        element: element,
        tickSignal: true,
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal (false -> true) -> initListenerOrientation
    expect(vector3SetFromMatrixPosition).toHaveBeenCalledTimes(1);
    expect(listenerSetPosition).toHaveBeenCalledTimes(1);
    // initListenerOrientation -> listener.tickSignal = false
    // watch:listener.tickSignal (true -> false) -> updateListenerOrientation
    expect(matrixWorldClone).toHaveBeenCalledTimes(1);
    expect(matrixWorldSetPosition).toHaveBeenCalledTimes(1);
    expect(vector3ApplyMatrix4).toHaveBeenCalledTimes(2);
    expect(vector3Normalize).toHaveBeenCalledTimes(2);
    expect(listenerSetOrientation).toHaveBeenCalledTimes(1);
  });

  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameCamera, {
      stubs: stubs,
    });
    // Hack
    expect(wrapper.findAll("a-entity-stub").length).toBe(1);
  });
});
