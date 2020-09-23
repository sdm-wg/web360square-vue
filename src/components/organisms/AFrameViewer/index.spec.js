import { shallowMount } from "@vue/test-utils";
import AFrameViewer from ".";
import { parseViewer } from "@/utils/sparql.js";

describe("organisms/AFrameViewer", () => {
  let props;
  let stubs;

  beforeEach(() => {
    props = {
      viewerData: parseViewer([]),
      webAudio: {},
      mediaState: {},
      viewIndex: -1,
    };

    stubs = ["a-scene"];
  });

  it("checks props", () => {
    const wrapper = shallowMount(AFrameViewer, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("viewerData")).toBe(props.viewerData);
    expect(wrapper.props("webAudio")).toBe(props.webAudio);
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
    expect(wrapper.props("viewIndex")).toBe(props.viewIndex);
  });

  it("checks computed", async () => {
    const playlistFile = "VideoContentUrl";
    const eyeLevel = Math.random() * 10;
    const sourceN = Math.ceil(Math.random() * 10);
    props.viewerData = {
      videoList: [
        {
          playlistFile: playlistFile,
          position: { x: 0.0, y: eyeLevel, z: 0.0 },
        },
      ],
      audioList: new Array(sourceN).fill({
        convertedPosition: {},
      }),
    };

    const wrapper = shallowMount(AFrameViewer, {
      propsData: props,
      stubs: stubs,
    });

    let viewIndex;

    viewIndex = -1;
    wrapper.setProps({
      viewIndex: viewIndex,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.playlistFile).toBe("");
    expect(wrapper.vm.eyeLevel).toBe(0);
    expect(wrapper.vm.convertedAudioPositions.length).toBe(sourceN);

    viewIndex = 0;
    wrapper.setProps({
      viewIndex: viewIndex,
    });
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.playlistFile).toBe(playlistFile);
    expect(wrapper.vm.eyeLevel).toBe(eyeLevel);
    expect(wrapper.vm.convertedAudioPositions.length).toBe(sourceN);
  });

  it("has an `a-scene`", () => {
    const wrapper = shallowMount(AFrameViewer, {
      propsData: props,
      stubs: stubs,
    });
    // Hack
    expect(wrapper.find("a-scene-stub").exists()).toBe(true);
  });
});
