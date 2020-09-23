import { createLocalVue, shallowMount } from "@vue/test-utils";
import Event from ".";
import EventView from "@/components/templates/EventView";
import axios from "axios";
import AFRAME from "aframe";

jest.mock("axios");

const localVue = createLocalVue();
localVue.prototype.axios = axios;

describe("pages/Event", () => {
  // AudioContext mock variables
  let connect;
  let start;
  let stop;
  let setPosition;
  let createGain;
  let createDynamicsCompressor;
  let createBufferSource;
  let createAnalyser;
  let createPanner;
  let audioContextCurrentTime;

  // Route mock variables
  let eventId;
  let $route;

  // Axios mock variables
  let response;

  // AFRAME.THREE.Vector3 mock variables
  let vector3Add;
  let vector3ApplyEuler;

  beforeEach(() => {
    // AudioContext mock
    connect = jest.fn();
    start = jest.fn();
    stop = jest.fn();
    setPosition = jest.fn();
    createGain = jest.fn().mockImplementation(() => {
      return { connect: connect, gain: { value: 1 } };
    });
    createDynamicsCompressor = jest.fn().mockImplementation(() => {
      return { connect: connect };
    });
    createBufferSource = jest.fn().mockImplementation(() => {
      return { connect: connect, start: start, stop: stop };
    });
    createAnalyser = jest.fn().mockImplementation(() => {
      return { connect: connect };
    });
    createPanner = jest.fn().mockImplementation(() => {
      return { connect: connect, setPosition: setPosition };
    });
    audioContextCurrentTime = 5;
    window.AudioContext = jest.fn().mockImplementation(() => {
      return {
        createGain: createGain,
        createDynamicsCompressor: createDynamicsCompressor,
        createBufferSource: createBufferSource,
        createAnalyser: createAnalyser,
        createPanner: createPanner,
        currentTime: audioContextCurrentTime,
      };
    });

    // `console.error` mock
    jest.spyOn(console, "error").mockImplementation(() => {});

    // Route mock
    eventId = "eventId";
    $route = { query: { id: eventId } };

    // Axios mock
    response = { data: { results: { bindings: [] } } };
    axios.get.mockImplementation(() => {
      return Promise.resolve(response);
    });

    // AFRAME.THREE.Vector3 mock
    vector3ApplyEuler = jest.fn();
    vector3Add = jest.fn().mockImplementation(() => {
      return { applyEuler: vector3ApplyEuler };
    });

    AFRAME.THREE.Vector3 = jest.fn().mockImplementation(() => {
      return {
        add: vector3Add,
      };
    });
  });

  afterEach(() => {
    jest.clearAllMocks();

    // Reset AudioContext mock
    window.AudioContext = undefined;
    window.webkitAudioContext = undefined;

    console.error.mockRestore();
  });

  it("has a created hook", () => {
    expect(typeof Event.created).toBe("function");
  });

  it("has a destroyed hook", () => {
    expect(typeof Event.destroyed).toBe("function");
  });

  it("checks AudioContext when existing only window.webkitAudioContext", () => {
    // Reset AudioContext mock
    window.AudioContext = undefined;

    // Reset webkitAudioContext mock
    window.webkitAudioContext = jest.fn().mockImplementation(() => {
      return {
        createGain: createGain,
        createDynamicsCompressor: createDynamicsCompressor,
      };
    });

    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });

    expect(wrapper.vm.webAudio.audioContext).toEqual(
      new window.webkitAudioContext()
    );
  });

  it("checks viewerData changes on Axios success handling", async () => {
    // Override Axios mock
    const audioContentUrl = "AudioContentUrl";
    const videoContentUrl = "VideoContentUrl";
    const audioDuration = Math.random() * 10;
    const videoDuration = Math.random() * 10;
    const duration = Math.min(audioDuration, videoDuration);
    const response = {
      data: {
        results: {
          bindings: [
            {
              playerClass: { value: "AudioPlayer" },
              contentUrl: { value: audioContentUrl },
              eventTime: { value: "0.000" },
              viewLabel: { value: "" },
              endAt: { value: audioDuration.toString() },
              startAt: { value: "0.0" },
              x: { value: "1.00" },
              y: { value: "1.00" },
              z: { value: "1.00" },
              eulerDegX: { value: "" },
              eulerDegY: { value: "" },
              eulerDegZ: { value: "" },
              eulerOrder: { value: "" },
            },
            {
              playerClass: { value: "VideoPlayer" },
              contentUrl: { value: videoContentUrl },
              eventTime: { value: "" },
              viewLabel: { value: "" },
              endAt: { value: videoDuration.toString() },
              startAt: { value: "0.0" },
              x: { value: "0.00" },
              y: { value: "0.00" },
              z: { value: "0.00" },
              eulerDegX: { value: "0.00" },
              eulerDegY: { value: "0.00" },
              eulerDegZ: { value: "0.00" },
              eulerOrder: { value: "YXZ" },
            },
          ],
        },
      },
    };
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve(response);
    });

    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    // Created
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.audioList.length).toBe(0);
    expect(wrapper.vm.viewerData.videoList.length).toBe(0);

    await wrapper.vm.$nextTick();

    // SPARQL Axios (called by created)
    expect(wrapper.vm.viewerData.duration).toBe(duration);
    expect(wrapper.vm.viewerData.audioFile).toBe(audioContentUrl);
    expect(wrapper.vm.viewerData.audioList.length).toBe(1);
    expect(wrapper.vm.viewerData.videoList.length).toBe(1);
    expect(wrapper.vm.viewerData.videoList[0].playlistFile).toBe(
      videoContentUrl
    );
  });

  it("checks viewerData changes on Axios error handling", async () => {
    // Override Axios mock
    axios.get.mockImplementationOnce(() => {
      return new Promise(() => {
        throw new Error("error test");
      });
    });

    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    // Created
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.audioList.length).toBe(0);
    expect(wrapper.vm.viewerData.videoList.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // SPARQL Axios (called by created)
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.audioList.length).toBe(0);
    expect(wrapper.vm.viewerData.videoList.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("checks changeViewIndex", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      videoList: new Array(sourceN).fill(),
    };
    wrapper.setData({
      viewerData: viewerData,
    });

    await wrapper.vm.$nextTick();

    // Emitted changeViewIndex
    const index = Math.floor(Math.random() * sourceN);
    wrapper.vm.changeViewIndex(index);
    expect(wrapper.vm.viewIndex).toBe(index);
  });

  it("checks toggle between play and pause", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      audioList: new Array(sourceN).fill({
        spriteTime: {},
        position: {},
        convertedPosition: {},
      }),
    };
    const audioBuffer = "Audio Buffer";
    let isPlaying = false;
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer },
      mediaState: { isPlaying: isPlaying },
    });

    await wrapper.vm.$nextTick();

    // Watch webAudio.audioBuffer

    // Emitted togglePlayPause: isPlaying (false -> true)
    wrapper.vm.togglePlayPause();
    expect(start).toHaveBeenCalledTimes(sourceN);

    // Emitted togglePlayPause: isPlaying (true -> false)
    wrapper.vm.togglePlayPause();
    expect(stop).toHaveBeenCalledTimes(sourceN);
  });

  it("checks forwardRewind", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      duration: 20,
      audioList: new Array(sourceN).fill({
        spriteTime: {},
        position: {},
        convertedPosition: {},
      }),
    };
    const audioBuffer = "Audio Buffer";
    let isPlaying = false;
    let currentTime = 0;
    let pausedTotal = 0;
    let isForward;
    const interval = 10;
    wrapper.setData({
      viewerData: viewerData,
      webAudio: {
        audioBuffer: audioBuffer,
        currentTime: currentTime,
        pausedTime: {
          total: pausedTotal,
          range: { start: 0, end: null },
        },
      },
      mediaState: { isPlaying: isPlaying },
    });

    await wrapper.vm.$nextTick();

    // Watch webAudio.audioBuffer

    // Emitted forwardRewind: isForward = true
    // currentTime: 5sec, duration: 20sec
    // 10sec forward => currentTime: 15sec
    isForward = true;
    wrapper.vm.forwardRewind(isForward, interval);
    pausedTotal -= 10;
    currentTime = audioContextCurrentTime - pausedTotal;
    expect(wrapper.vm.webAudio.currentTime).toBe(currentTime);
    expect(wrapper.vm.mediaState.isForceSync).toBe(true);

    // Emitted forwardRewind: isForward = true
    // currentTime: 15sec, duration: 20sec
    // 0sec forward => currentTime: 15sec
    isForward = true;
    wrapper.vm.forwardRewind(isForward, interval);
    currentTime = audioContextCurrentTime - pausedTotal;
    expect(wrapper.vm.webAudio.currentTime).toBe(currentTime);
    expect(wrapper.vm.mediaState.isForceSync).toBe(true);

    // Emitted forwardRewind: isForward = false
    // currentTime: 15sec, duration: 20sec
    // 10sec rewind => currentTime: 5sec
    isForward = false;
    wrapper.vm.forwardRewind(isForward, interval);
    pausedTotal += 10;
    currentTime = audioContextCurrentTime - pausedTotal;
    expect(wrapper.vm.webAudio.currentTime).toBe(currentTime);
    expect(wrapper.vm.mediaState.isForceSync).toBe(true);

    // Emitted forwardRewind: isForward = false
    // currentTime: 5sec, duration: 20sec
    // 5sec rewind => currentTime: 0sec
    isForward = false;
    wrapper.vm.forwardRewind(isForward, interval);
    pausedTotal += currentTime;
    currentTime = audioContextCurrentTime - pausedTotal;
    expect(wrapper.vm.webAudio.currentTime).toBe(currentTime);
    expect(wrapper.vm.mediaState.isForceSync).toBe(true);

    isPlaying = true;
    wrapper.setData({
      viewerData: viewerData,
      webAudio: {
        audioBuffer: audioBuffer,
        currentTime: currentTime,
        pausedTime: {
          total: pausedTotal,
          range: { start: 1, end: 1 },
        },
      },
      mediaState: { isPlaying: isPlaying },
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.webAudio.pausedTime.range.start).toBe(1);
    expect(wrapper.vm.webAudio.pausedTime.range.end).toBe(1);

    isForward = true;
    wrapper.vm.forwardRewind(isForward, interval);

    // Reset pausedTime.range
    expect(wrapper.vm.webAudio.pausedTime.range.start).toBe(null);
    expect(wrapper.vm.webAudio.pausedTime.range.end).toBe(null);

    // `isPlaying` is true -> playPauseAll(false) and playPauseAll(true)
    expect(stop).toHaveBeenCalledTimes(sourceN);
    expect(start).toHaveBeenCalledTimes(sourceN);
  });

  it("checks toggle between mute and unmute", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      audioList: new Array(sourceN).fill({
        spriteTime: {},
        position: {},
        convertedPosition: {},
      }),
    };
    const audioBuffer = "Audio Buffer";
    const maxVolume = 1;
    let isPlaying = false;
    let isMuted;
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer, maxVolume: maxVolume },
      mediaState: { isPlaying: isPlaying },
    });

    await wrapper.vm.$nextTick();

    // Watch webAudio.audioBuffer

    // Emitted toggleMute(true)
    isMuted = true;
    wrapper.vm.toggleMute(isMuted);
    expect(wrapper.vm.webAudio.gains[0].gain.value).toBe(maxVolume);

    // Emitted toggleMute(false)
    isMuted = false;
    wrapper.vm.toggleMute(isMuted);
    expect(wrapper.vm.webAudio.gains[0].gain.value).toBe(0);
  });

  it("checks eventId watcher", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    // sparqlFetch methods mock
    const sparqlFetch = jest.fn();
    wrapper.vm.sparqlFetch = sparqlFetch;

    // While Created
    expect(wrapper.vm.$route.query.id).toBe(eventId);
    expect(sparqlFetch).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // SPARQL Axios (called by created)

    // Change query.id
    eventId = "newEventId";
    wrapper.vm.$route.query.id = eventId;
    expect(wrapper.vm.$route.query.id).toBe(eventId);

    await wrapper.vm.$nextTick();

    // SPARQL Axios (called by watch)
    expect(sparqlFetch).toHaveBeenCalledTimes(1);
  });

  it("checks viewerData.audioFile watcher and loads audio data on Axios success handling", async () => {
    // Reset AudioContext mock
    window.AudioContext = undefined;

    // AudioContext mock
    const decodeAudioData = jest.fn().mockImplementation((data, cb) => {
      // dummy data parse process
      const buffer = data;

      cb(buffer);
    });
    window.AudioContext = jest.fn().mockImplementation(() => {
      return {
        createGain: createGain,
        createDynamicsCompressor: createDynamicsCompressor,
        decodeAudioData: decodeAudioData,
      };
    });

    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    // After created
    expect(decodeAudioData).toHaveBeenCalledTimes(0);

    const audioContentUrl = "http://AudioContentUrl";
    wrapper.setData({ viewerData: { audioFile: audioContentUrl } });
    await wrapper.vm.$nextTick();

    // watch: viewerData.audioFile -> loadAudio (success)
    expect(decodeAudioData).toHaveBeenCalledTimes(1);
  });

  it("checks viewerData.audioFile watcher and loads audio data on Axios error handling", async () => {
    // Override Axios mock
    axios.get
      .mockImplementationOnce(() => {
        // SPARQL Axios: Success
        return Promise.resolve(response);
      })
      .mockImplementationOnce(() => {
        // Audio Axios: Error
        return new Promise(() => {
          throw new Error("error test");
        });
      });

    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    // After created
    expect(console.error).toHaveBeenCalledTimes(0);

    const audioContentUrl = "http://AudioContentUrl";
    wrapper.setData({ viewerData: { audioFile: audioContentUrl } });
    await wrapper.vm.$nextTick();

    // watch: viewerData.audioFile -> loadAudio (running)

    await wrapper.vm.$nextTick();

    // loadAudio (running) -> loadAudio (error)
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("checks webAudio.audioBuffer watcher", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      audioList: new Array(sourceN).fill({
        spriteTime: {},
        position: {},
        convertedPosition: {},
      }),
    };
    let audioBuffer;

    // After created
    // Only create master gain and compressor
    expect(createGain).toHaveBeenCalledTimes(1);
    expect(createDynamicsCompressor).toHaveBeenCalledTimes(1);
    expect(wrapper.vm.mediaState.isLoading.audio).toBe(true);

    audioBuffer = "";
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer },
    });
    await wrapper.vm.$nextTick();

    // Invalid audioBuffer
    // Nothing happens
    expect(createGain).toHaveBeenCalledTimes(1);
    expect(createBufferSource).toHaveBeenCalledTimes(0);
    expect(createAnalyser).toHaveBeenCalledTimes(0);
    expect(createPanner).toHaveBeenCalledTimes(0);

    audioBuffer = "Audio Buffer";
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer },
    });
    await wrapper.vm.$nextTick();

    // Valid audioBuffer
    // Create `sourceN` nodes
    expect(createGain).toHaveBeenCalledTimes(sourceN + 1);
    expect(createBufferSource).toHaveBeenCalledTimes(sourceN);
    expect(createAnalyser).toHaveBeenCalledTimes(sourceN);
    expect(createPanner).toHaveBeenCalledTimes(sourceN);
    expect(wrapper.vm.mediaState.isLoading.audio).toBe(false);
  });

  it("checks webAudio.currentTime watcher", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const duration = Math.ceil(Math.random() * 10);
    const currentTime = Math.random() * duration;
    wrapper.setData({
      viewerData: { duration: duration },
      webAudio: { currentTime: currentTime },
      mediaState: { currentRate: 0 },
    });
    await wrapper.vm.$nextTick();

    // Watch webAudio.currentTime
    expect(wrapper.vm.mediaState.currentRate).toBe(currentTime / duration);
  });

  it("checks viewIndex watcher when webAudio.panners have been created and viewIndex is valid", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      videoList: [
        {
          position: { x: 0.0, y: 0.0, z: 0.0 },
          euler: { x: 0.0, y: 0.0, z: 0.0, order: "YXZ" },
        },
      ],
      audioList: new Array(sourceN).fill({
        position: { x: 0.0, y: 0.0, z: 0.0 },
        convertedPosition: { x: 0.0, y: 0.0, z: 0.0 },
      }),
    };
    const webAudio = {
      panners: new Array(sourceN).fill(createPanner()),
    };
    const viewIndex = 0;

    wrapper.setData({
      viewerData: viewerData,
      webAudio: webAudio,
      viewIndex: viewIndex,
    });
    await wrapper.vm.$nextTick();

    // Watch viewIndex
    expect(vector3Add).toHaveBeenCalledTimes(sourceN);
    expect(vector3ApplyEuler).toHaveBeenCalledTimes(sourceN);
    expect(setPosition).toHaveBeenCalledTimes(sourceN);
  });

  it("checks viewIndex watcher when viewIndex is invalid", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    // Invalid index
    const viewIndex = -2;

    wrapper.setData({
      viewIndex: viewIndex,
    });
    await wrapper.vm.$nextTick();

    // Watch viewIndex (invalid index)
    // Nothing happens
    expect(wrapper.vm.viewIndex).toBe(viewIndex);
  });

  it("has a EventView component", () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    expect(wrapper.findComponent(EventView).exists()).toBe(true);
  });

  it("pauses audio sources if `isPlaying` is true when destroyed", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      audioList: new Array(sourceN).fill({
        spriteTime: {},
        position: {},
        convertedPosition: {},
      }),
    };
    const audioBuffer = "Audio Buffer";
    let isPlaying = false;
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer },
      mediaState: { isPlaying: isPlaying },
    });

    await wrapper.vm.$nextTick();

    // Watch webAudio.audioBuffer

    // Emitted togglePlayPause: isPlaying (false -> true)
    wrapper.vm.togglePlayPause();
    expect(start).toHaveBeenCalledTimes(sourceN);

    wrapper.destroy();

    expect(stop).toHaveBeenCalledTimes(sourceN);
  });

  it("pauses audio sources if `isPlaying` is false when destroyed", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      positions: new Array(sourceN).fill({}),
      spriteTimes: new Array(sourceN).fill({}),
    };
    const audioBuffer = "Audio Buffer";
    const isPlaying = false;
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer },
      mediaState: { isPlaying: isPlaying },
    });

    await wrapper.vm.$nextTick();

    // Watch webAudio.audioBuffer

    wrapper.destroy();

    // Nothing happens
    expect(stop).toHaveBeenCalledTimes(0);
  });
});
