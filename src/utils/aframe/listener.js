import AFRAME from "aframe";

export const listener = {
  initReady: false,
  element: null,
  tickSignal: false,
};

AFRAME.registerComponent("listener", {
  init: function() {
    listener.initReady = true;
    listener.element = this.el;
  },
  tick: function() {
    listener.tickSignal = !listener.tickSignal;
  },
});
