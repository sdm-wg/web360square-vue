import { shallowMount } from "@vue/test-utils";
import AFrameCamera from ".";
import AFRAME from "aframe";

describe("molecules/AFrameCamera", () => {
  // AudioContext mock variables
  let listenerSetPosition;
  let listenerSetOrientation;
  let audioContextCurrentTime;

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
    audioContextCurrentTime = 10.0;
    window.AudioContext = jest.fn().mockImplementation(() => {
      return {
        listener: {
          setPosition: listenerSetPosition,
          setOrientation: listenerSetOrientation,
        },
        currentTime: audioContextCurrentTime,
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
      duration: 0,
      webAudio: {
        audioContext: new window.AudioContext(),
        currentTime: 0,
      },
      mediaState: {
        isLoading: { audio: true, video: true },
        isPlaying: false,
      },
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
    // HACK: For some reason, not destroyed wrapper will affect later tests.
    wrapper.destroy();
  });

  it("checks ListenerOrientation on listener.tickSignal watcher", async () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    let tickSignal = wrapper.vm.listener.tickSignal;

    const initListenerOrientation = jest.fn();
    const updateListenerOrientation = jest.fn();
    wrapper.vm.initListenerOrientation = initListenerOrientation;
    wrapper.vm.updateListenerOrientation = updateListenerOrientation;

    // After created
    expect(initListenerOrientation).toHaveBeenCalledTimes(0);
    expect(updateListenerOrientation).toHaveBeenCalledTimes(0);

    tickSignal = !tickSignal;
    wrapper.setData({
      listener: {
        initReady: true,
        tickSignal: tickSignal,
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal -> initListenerOrientation
    expect(initListenerOrientation).toHaveBeenCalledTimes(1);
    // initListenerOrientation -> listener.initReady = false

    tickSignal = !tickSignal;
    wrapper.setData({
      listener: {
        initReady: false,
        tickSignal: tickSignal,
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal -> updateListenerOrientation
    expect(updateListenerOrientation).toHaveBeenCalledTimes(1);
  });

  it("checks ListenerOrientation", () => {
    // initListenerOrientation (element.object3D is undefined)
    AFrameCamera.methods.initListenerOrientation({}, props.webAudio);
    expect(vector3SetFromMatrixPosition).toHaveBeenCalledTimes(0);
    expect(listenerSetPosition).toHaveBeenCalledTimes(0);

    // initListenerOrientation (element.object3D has been defined)
    AFrameCamera.methods.initListenerOrientation(element, props.webAudio);
    expect(vector3SetFromMatrixPosition).toHaveBeenCalledTimes(1);
    expect(listenerSetPosition).toHaveBeenCalledTimes(1);

    // updateListenerOrientation (element.object3D is undefined)
    AFrameCamera.methods.updateListenerOrientation({}, props.webAudio);
    expect(matrixWorldClone).toHaveBeenCalledTimes(0);
    expect(matrixWorldSetPosition).toHaveBeenCalledTimes(0);
    expect(vector3ApplyMatrix4).toHaveBeenCalledTimes(0);
    expect(vector3Normalize).toHaveBeenCalledTimes(0);
    expect(listenerSetOrientation).toHaveBeenCalledTimes(0);

    // updateListenerOrientation (element.object3D has been defined)
    AFrameCamera.methods.updateListenerOrientation(element, props.webAudio);
    expect(matrixWorldClone).toHaveBeenCalledTimes(1);
    expect(matrixWorldSetPosition).toHaveBeenCalledTimes(1);
    expect(vector3ApplyMatrix4).toHaveBeenCalledTimes(2);
    expect(vector3Normalize).toHaveBeenCalledTimes(2);
    expect(listenerSetOrientation).toHaveBeenCalledTimes(1);
  });

  it("checks updateCurrentTime when mediaState.isPlaying is true (not paused)", async () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    let tickSignal = wrapper.vm.listener.tickSignal;

    tickSignal = !tickSignal;
    const start = 0.0;
    const end = 0.0;
    const duration = audioContextCurrentTime;
    wrapper.setData({
      listener: {
        initReady: false,
        tickSignal: tickSignal,
      },
      pausedTime: {
        total: 0,
        range: { start: start, end: end },
      },
    });
    wrapper.setProps({
      duration: duration,
      mediaState: {
        isLoading: { audio: false, video: false },
        isPlaying: true,
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal -> updateCurrentTime (mediaState.isPlaying: true)
    // Not paused
    expect(wrapper.vm.pausedTime.range.start).toBe(start);
    expect(wrapper.vm.pausedTime.range.end).toBe(end);
    expect(wrapper.vm.webAudio.currentTime).toBe(audioContextCurrentTime);
  });

  it("checks updateCurrentTime when mediaState.isPlaying is true (no loop will happen)", async () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    let tickSignal = wrapper.vm.listener.tickSignal;

    tickSignal = !tickSignal;
    const start = 1.0;
    const end = 6.0;
    const duration = 6.0;
    wrapper.setData({
      listener: {
        initReady: false,
        tickSignal: tickSignal,
      },
      pausedTime: {
        total: 0,
        range: { start: start, end: end },
      },
    });
    wrapper.setProps({
      duration: duration,
      mediaState: {
        isLoading: { audio: false, video: false },
        isPlaying: true,
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal -> updateCurrentTime (mediaState.isPlaying: true)
    // No loop will happen (webAudio.currentTime < duration)
    const pausedTotal = end - start;
    expect(wrapper.vm.pausedTime.total).toBe(pausedTotal);
    expect(wrapper.vm.pausedTime.range.start).toBe(null);
    expect(wrapper.vm.pausedTime.range.end).toBe(null);
    expect(wrapper.vm.webAudio.currentTime).toBe(
      audioContextCurrentTime - pausedTotal
    );
  });

  it("checks updateCurrentTime when mediaState.isPlaying is true (loop will happen)", async () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    let tickSignal = wrapper.vm.listener.tickSignal;

    tickSignal = !tickSignal;
    const start = 1.0;
    const end = 6.0;
    const duration = 4.0;
    wrapper.setData({
      listener: {
        initReady: false,
        tickSignal: tickSignal,
      },
      pausedTime: {
        total: 0,
        range: { start: start, end: end },
      },
    });
    wrapper.setProps({
      duration: duration,
      mediaState: {
        isLoading: { audio: false, video: false },
        isPlaying: true,
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal -> updateCurrentTime (mediaState.isPlaying: true)
    // Loop will happen (webAudio.currentTime > duration)
    const pausedTotal = end - start;
    expect(wrapper.vm.pausedTime.range.start).toBe(null);
    expect(wrapper.vm.pausedTime.range.end).toBe(null);
    expect(wrapper.vm.webAudio.currentTime).toBe(
      audioContextCurrentTime - pausedTotal - duration
    );
    expect(wrapper.vm.pausedTime.total).toBe(pausedTotal + duration);
  });

  it("checks updateCurrentTime when mediaState.isPlaying is false", async () => {
    const wrapper = shallowMount(AFrameCamera, {
      propsData: props,
      stubs: stubs,
    });
    let tickSignal = wrapper.vm.listener.tickSignal;

    tickSignal = !tickSignal;
    wrapper.setData({
      listener: {
        initReady: false,
        tickSignal: tickSignal,
      },
      pausedTime: {
        total: 0,
        range: { start: null, end: null },
      },
    });
    await wrapper.vm.$nextTick();

    // watch:listener.tickSignal -> updateCurrentTime (mediaState.isPlaying: false)
    expect(wrapper.vm.pausedTime.range.start).toBe(audioContextCurrentTime);
    expect(wrapper.vm.pausedTime.range.end).toBe(audioContextCurrentTime);
  });

  it("has an `a-entity`", () => {
    const wrapper = shallowMount(AFrameCamera, {
      stubs: stubs,
    });
    // HACK: find stub elements
    expect(wrapper.findAll("a-entity-stub").length).toBe(1);
  });
});
