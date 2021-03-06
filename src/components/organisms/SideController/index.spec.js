import { shallowMount } from "@vue/test-utils";
import SideController from ".";
import Logo from "@/components/atoms/Logo";
import ForwardRewindSVG from "@/components/atoms/ForwardRewindSVG";
import MuteSVG from "@/components/atoms/MuteSVG";
import PlaySVG from "@/components/molecules/PlaySVG";

describe("organisms/SideController", () => {
  let props;
  let stubs;

  beforeEach(() => {
    props = {
      webAudio: {
        gains: [],
      },
      mediaState: {
        isLoading: { audio: true, video: true },
        isPlaying: false,
      },
    };

    stubs = ["router-link"];
  });

  it("checks props", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.props("mediaState")).toBe(props.mediaState);
  });

  it("emits `togglePlayPause` when clicked PlaySVG", async () => {
    // Override props.mediaState.isLoading (audio and video are false)
    // Media data has been loaded
    props.mediaState.isLoading.audio = false;
    props.mediaState.isLoading.video = false;
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.emitted("togglePlayPause")).toBeTruthy();
  });

  it("can not emit `togglePlayPause` if mediaState.isLoading is true", async () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    // Nothing happens
    wrapper.findComponent(PlaySVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isMediaLoading).toBe(true);
    expect(wrapper.emitted("togglePlayPause")).toBeFalsy();
  });

  it("emits `forwardRewind` when clicked ForwardRewindSVG", async () => {
    // Override props.mediaState.isLoading (audio and video are false)
    // Media data has been loaded
    props.mediaState.isLoading.audio = false;
    props.mediaState.isLoading.video = false;
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });

    const forwardRewind = wrapper.findAllComponents(ForwardRewindSVG);
    const rewind = forwardRewind.at(0);
    const forward = forwardRewind.at(1);
    const interval = 10;

    rewind.trigger("click");
    forward.trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.emitted("forwardRewind").length).toBe(2);
    expect(wrapper.emitted("forwardRewind")[0][0]).toBe(false);
    expect(wrapper.emitted("forwardRewind")[0][1]).toBe(interval);
    expect(wrapper.emitted("forwardRewind")[1][0]).toBe(true);
    expect(wrapper.emitted("forwardRewind")[1][1]).toBe(interval);
  });

  it("can not emit `forwardRewind` if mediaState.isLoading is true", async () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });

    const forwardRewind = wrapper.findAllComponents(ForwardRewindSVG);
    const rewind = forwardRewind.at(0);
    const forward = forwardRewind.at(1);

    // Nothing happens
    rewind.trigger("click");
    forward.trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.vm.isMediaLoading).toBe(true);
    expect(wrapper.emitted("forwardRewind")).toBeFalsy();
  });

  it("emits `toggleMute` when clicked MuteSVG", async () => {
    // Override props.mediaState.isLoading (audio and video are false)
    // Media data has been loaded
    props.mediaState.isLoading.audio = false;
    props.mediaState.isLoading.video = false;
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });

    let isMuted;

    wrapper.setProps({ webAudio: { gains: [{ gain: { value: 1 } }] } });
    await wrapper.vm.$nextTick();
    wrapper.findComponent(MuteSVG).trigger("click");
    await wrapper.vm.$nextTick();
    isMuted = false;
    expect(wrapper.vm.isMuted).toBe(isMuted);
    expect(wrapper.emitted("toggleMute").length).toBe(1);
    expect(wrapper.emitted("toggleMute")[0][0]).toBe(isMuted);

    wrapper.setProps({ webAudio: { gains: [{ gain: { value: 0 } }] } });
    await wrapper.vm.$nextTick();
    wrapper.findComponent(MuteSVG).trigger("click");
    await wrapper.vm.$nextTick();
    isMuted = true;
    expect(wrapper.vm.isMuted).toBe(isMuted);
    expect(wrapper.emitted("toggleMute").length).toBe(2);
    expect(wrapper.emitted("toggleMute")[1][0]).toBe(isMuted);
  });

  it("can not emit `toggleMute` if mediaState.isLoading is true", async () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    // Nothing happens
    wrapper.findComponent(MuteSVG).trigger("click");
    await wrapper.vm.$nextTick();
    expect(wrapper.vm.isMediaLoading).toBe(true);
    expect(wrapper.emitted("toggleMute")).toBeFalsy();
  });

  it("has a PlaySVG component", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.findComponent(PlaySVG).exists()).toBe(true);
  });

  it("has ForwardRewindSVG components", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.findAllComponents(ForwardRewindSVG).length).toBe(2);
  });

  it("has a MuteSVG component", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.findComponent(MuteSVG).exists()).toBe(true);
  });

  it("has a Logo component", () => {
    const wrapper = shallowMount(SideController, {
      propsData: props,
      stubs: stubs,
    });
    expect(wrapper.findComponent(Logo).exists()).toBe(true);
  });
});
