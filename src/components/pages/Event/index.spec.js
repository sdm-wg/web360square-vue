import { createLocalVue, shallowMount } from "@vue/test-utils";
import axios from "axios";
import Event from ".";
import EventView from "@/components/templates/EventView";

jest.mock("axios");

const connect = jest.fn();
const setPosition = jest.fn();
const createGain = jest.fn().mockImplementation(() => {
  return { connect: connect };
});
const createDynamicsCompressor = jest.fn().mockImplementation(() => {
  return { connect: connect };
});
const createBufferSource = jest.fn().mockImplementation(() => {
  return { connect: connect };
});
const createAnalyser = jest.fn().mockImplementation(() => {
  return { connect: connect };
});
const createPanner = jest.fn().mockImplementation(() => {
  return { connect: connect, setPosition: setPosition };
});
window.webkitAudioContext = jest.fn().mockImplementation(() => {
  return {
    createGain: createGain,
    createDynamicsCompressor: createDynamicsCompressor,
    createBufferSource: createBufferSource,
    createAnalyser: createAnalyser,
    createPanner: createPanner,
  };
});

const localVue = createLocalVue();
localVue.prototype.axios = axios;

describe("pages/Event", () => {
  it("has a created hook", () => {
    expect(typeof Event.created).toBe("function");
  });

  it("checks data changes on Axios success handling", async () => {
    // Route mock
    const eventId = "eventId";
    const $route = {
      query: {
        id: eventId,
      },
    };

    // Axios mock
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
      mocks: {
        $route,
      },
      localVue,
    });
    // Created
    expect(wrapper.vm.$route.query.id).toBe(eventId);
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.playlistFile).toBe("");
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.positions.length).toBe(0);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(0);

    await wrapper.vm.$nextTick();

    // Axios (called by created)
    expect(wrapper.vm.viewerData.audioFile).toBe(audioContentUrl);
    expect(wrapper.vm.viewerData.playlistFile).toBe(videoContentUrl);
    expect(wrapper.vm.viewerData.duration).toBe(duration);
    expect(wrapper.vm.viewerData.positions.length).toBe(1);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(1);
  });

  it("checks data changes on Axios error handling", async () => {
    // Route mock
    const eventId = "eventId";
    const $route = {
      query: {
        id: eventId,
      },
    };

    // Axios mock
    axios.get.mockImplementationOnce(() => {
      return new Promise(() => {
        throw new Error("error test");
      });
    });

    // `console.error` mock
    console.error = jest.fn();

    const wrapper = shallowMount(Event, {
      mocks: {
        $route,
      },
      localVue,
    });
    // Created
    expect(wrapper.vm.$route.query.id).toBe(eventId);
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.playlistFile).toBe("");
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.positions.length).toBe(0);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // Axios (called by created)
    expect(wrapper.vm.viewerData.audioFile).toBe("");
    expect(wrapper.vm.viewerData.playlistFile).toBe("");
    expect(wrapper.vm.viewerData.duration).toBe(0);
    expect(wrapper.vm.viewerData.positions.length).toBe(0);
    expect(wrapper.vm.viewerData.spriteTimes.length).toBe(0);
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("decodes audio data", async () => {
    // AudioContext mock
    const createGain = jest.fn();
    const createDynamicsCompressor = jest.fn();
    const decodeAudioData = jest.fn().mockImplementation((data, cb) => {
      cb(data);
    });
    window.AudioContext = jest.fn().mockImplementation(() => {
      return {
        createGain: createGain,
        createDynamicsCompressor: createDynamicsCompressor,
        decodeAudioData: decodeAudioData,
      };
    });

    // Route mock
    const eventId = "eventId";
    const $route = {
      query: {
        id: eventId,
      },
    };

    // Axios mock
    axios.get
      .mockImplementationOnce(() => {
        return Promise.resolve({});
      })
      .mockImplementationOnce(() => {
        return Promise.resolve({});
      });

    const wrapper = shallowMount(Event, {
      mocks: {
        $route,
      },
      localVue,
    });
    const audioContentUrl = "http://AudioContentUrl";
    wrapper.setData({
      viewerData: {
        audioFile: audioContentUrl,
      },
    });
    expect(decodeAudioData).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // watch: viewerData.audioFile
    // loadAudio
    expect(decodeAudioData).toHaveBeenCalledTimes(1);

    // Reset mock
    window.AudioContext = undefined;
  });

  it("checks fetching audio data error", async () => {
    // Route mock
    const eventId = "eventId";
    const $route = {
      query: {
        id: eventId,
      },
    };

    // Axios mock
    axios.get
      .mockImplementationOnce(() => {
        return new Promise((resolve) => {
          resolve({});
        });
      })
      .mockImplementationOnce(() => {
        return new Promise(() => {
          throw new Error("error test");
        });
      });

    // `console.error` mock
    console.error = jest.fn();

    const wrapper = shallowMount(Event, {
      mocks: {
        $route,
      },
      localVue,
    });
    const audioContentUrl = "http://AudioContentUrl";
    wrapper.setData({
      viewerData: {
        audioFile: audioContentUrl,
      },
    });
    expect(console.error).toHaveBeenCalledTimes(0);

    await wrapper.vm.$nextTick();

    // watch: viewerData.audioFile
    // loadAudio
    expect(console.error).toHaveBeenCalledTimes(1);
  });

  it("test", async () => {
    // Route mock
    const eventId = "eventId";
    const $route = {
      query: {
        id: eventId,
      },
    };

    // Axios mock
    axios.get.mockImplementation(() => {
      return new Promise((resolve) => {
        resolve({});
      });
    });

    const wrapper = shallowMount(Event, {
      mocks: {
        $route,
      },
      localVue,
    });
    const audioBuffer = "Audio Buffer";
    wrapper.setData({
      viewerData: {
        positions: [{ x: 0.0, y: 0.0, z: 0.0 }],
        spriteTimes: [{ start: 0.0, end: 10.0 }],
      },
      webAudio: {
        audioBuffer: audioBuffer,
      },
    });
    await wrapper.vm.$nextTick();
  });

  it("checks watch", async () => {
    // Route mock
    let eventId = "eventId";
    const $route = {
      query: {
        id: eventId,
      },
    };

    // Axios mock
    const dummyResponse = {
      data: {
        results: {
          bindings: [],
        },
      },
    };
    axios.get
      .mockImplementationOnce(() => {
        return Promise.resolve(dummyResponse);
      })
      .mockImplementationOnce(() => {
        return Promise.resolve(dummyResponse);
      });

    // Methods mock
    const methods = {
      sparqlFetch: jest.fn(),
    };

    const wrapper = shallowMount(Event, {
      mocks: {
        $route,
      },
      localVue,
      methods,
    });
    // Created
    expect(wrapper.vm.$route.query.id).toBe(eventId);
    expect(methods.sparqlFetch).toHaveBeenCalledTimes(1);

    await wrapper.vm.$nextTick();

    // Axios (called by created)

    // Change query.id
    eventId = "newEventId";
    wrapper.vm.$route.query.id = eventId;
    expect(wrapper.vm.$route.query.id).toBe(eventId);

    await wrapper.vm.$nextTick();

    // Axios (called by watch)
    expect(methods.sparqlFetch).toHaveBeenCalledTimes(2);
  });

  it("has a EventView component", () => {
    // Route mock
    const $route = { query: { id: "" } };

    // Axios mock
    axios.get.mockImplementationOnce(() => {
      return Promise.resolve();
    });

    const wrapper = shallowMount(Event, {
      mocks: {
        $route,
      },
      localVue,
    });
    expect(wrapper.findComponent(EventView).exists()).toBe(true);
  });
});
