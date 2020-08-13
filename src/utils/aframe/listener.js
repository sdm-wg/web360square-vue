import AFRAME from "aframe";

export const listener = {
  initReady: false,
  tickSignal: false,
};

AFRAME.registerComponent("listener", {
  init: function() {
    listener.initReady = true;
  },
  tick: function() {
    listener.tickSignal = !listener.tickSignal;
  },
});
