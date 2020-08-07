import { createLocalVue, shallowMount } from "@vue/test-utils";
import Vuex from "vuex";
import axios from "axios";
import Event from ".";
import EventView from "@/components/templates/EventView";

jest.mock("axios");

const localVue = createLocalVue();
localVue.use(Vuex);
localVue.prototype.axios = axios;

describe("pages/Event", () => {
  // Vuex mock variables
  let state;
  let getters;
  let mutations;
  let store;

  // AudioContext mock variables
  let connect;
  let start;
  let setPosition;
  let createGain;
  let createDynamicsCompressor;
  let createBufferSource;
  let createAnalyser;
  let createPanner;

  // Route mock variables
  let eventId;
  let $route;

  // Axios mock variables
  let response;

  beforeEach(() => {
    // Vuex mock
    state = { isPlaying: false };
    getters = {
      getIsPlaying: (state) => {
        return state.isPlaying;
      },
    };
    mutations = {
      setIsPlaying(state, bool) {
        state.isPlaying = bool;
      },
    };
    store = new Vuex.Store({
      modules: {
        event: {
          namespaced: true,
          state,
          getters,
          mutations,
        },
      },
    });

    // AudioContext mock
    connect = jest.fn();
    start = jest.fn();
    setPosition = jest.fn();
    createGain = jest.fn().mockImplementation(() => {
      return { connect: connect };
    });
    createDynamicsCompressor = jest.fn().mockImplementation(() => {
      return { connect: connect };
    });
    createBufferSource = jest.fn().mockImplementation(() => {
      return { connect: connect, start: start };
    });
    createAnalyser = jest.fn().mockImplementation(() => {
      return { connect: connect };
    });
    createPanner = jest.fn().mockImplementation(() => {
      return { connect: connect, setPosition: setPosition };
    });
    window.AudioContext = jest.fn().mockImplementation(() => {
      return {
        createGain: createGain,
        createDynamicsCompressor: createDynamicsCompressor,
        createBufferSource: createBufferSource,
        createAnalyser: createAnalyser,
        createPanner: createPanner,
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
      store,
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
              x: { value: "1.00" },
              y: { value: "1.00" },
              z: { value: "1.00" },
              endAt: { value: audioDuration.toString() },
              startAt: { value: "0.0" },
            },
            {
              playerClass: { value: "VideoPlayer" },
              contentUrl: { value: videoContentUrl },
              eventTime: { value: "0.000" },
              x: { value: "0.00" },
              y: { value: "0.00" },
              z: { value: "0.00" },
              endAt: { value: videoDuration.toString() },
              startAt: { value: "0.0" },
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
      store,
      localVue,
    });
    // Created
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.playlistFile).toBe("");
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.positions.length).toBe(0);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(0);

    await wrapper.vm.$nextTick();

    // SPARQL Axios (called by created)
    expect(wrapper.vm.viewerData.audioFile).toBe(audioContentUrl);
    expect(wrapper.vm.viewerData.playlistFile).toBe(videoContentUrl);
    expect(wrapper.vm.viewerData.duration).toBe(duration);
    expect(wrapper.vm.viewerData.positions.length).toBe(1);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(1);
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
      store,
      localVue,
    });
    // Created
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.playlistFile).toBe("");
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.positions.length).toBe(0);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // SPARQL Axios (called by created)
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.playlistFile).toBe("");
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.positions.length).toBe(0);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("checks eventId watcher", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      store,
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
      store,
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
      store,
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
      store,
      localVue,
    });
    await wrapper.vm.$nextTick();
    // Complete sparqlFetch (called by created)

    const sourceN = Math.ceil(Math.random() * 10);
    const viewerData = {
      positions: new Array(sourceN).fill({}),
      spriteTimes: new Array(sourceN).fill({}),
    };
    let audioBuffer;

    // After created
    // Only create master gain and compressor
    expect(createGain).toHaveBeenCalledTimes(1);
    expect(createDynamicsCompressor).toHaveBeenCalledTimes(1);

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
  });

  it("checks isPlaying watcher", async () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      store,
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
    wrapper.setData({
      viewerData: viewerData,
      webAudio: { audioBuffer: audioBuffer },
    });

    await wrapper.vm.$nextTick();

    // Watch webAudio.audioBuffer

    wrapper.vm.$store.commit("event/setIsPlaying", true);
    await wrapper.vm.$nextTick();

    // Watch isPlaying (false -> true)
    expect(start).toHaveBeenCalledTimes(sourceN);

    wrapper.vm.$store.commit("event/setIsPlaying", false);
    await wrapper.vm.$nextTick();

    // Watch isPlaying (true -> false)
    // Nothing happens
    expect(start).toHaveBeenCalledTimes(sourceN);
  });

  it("has a EventView component", () => {
    const wrapper = shallowMount(Event, {
      mocks: { $route },
      store,
      localVue,
    });
    expect(wrapper.findComponent(EventView).exists()).toBe(true);
  });
});
