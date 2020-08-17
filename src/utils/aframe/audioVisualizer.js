import AFRAME from "aframe";

export const audioVisualizers = [];
export const registeredAudioVisualizer = { num: 0 };

AFRAME.registerComponent("audio-visualizer", {
  schema: { type: "int" },
  init: function() {
    /*
     * Note: Tick
     *       - Minimum interval  : 50 msec
     *       - Maximum frame rate: 20 fps
     */
    this.tick = AFRAME.utils.throttleTick(this.tick, 50, this);

    registeredAudioVisualizer.num++;

    const i = this.data;
    audioVisualizers[i] = {
      initReady: true,
      tickSignal: false,
    };
  },
  tick: function() {
    const i = this.data;
    audioVisualizers[i].tickSignal = !audioVisualizers[i].tickSignal;
  },
  remove: function() {
    registeredAudioVisualizer.num--;
  },
});

export const updateValidFrequencyBand = (
  frequencyData,
  frequencyBinCount,
  validFrequencyBand
) => {
  const minValidIndex = frequencyData.findIndex((x) => x > 0);
  if (
    minValidIndex !== -1 &&
    (validFrequencyBand.min === null || validFrequencyBand.min > minValidIndex)
  ) {
    validFrequencyBand.min = minValidIndex;
  }

  const revFrequencyData = [...frequencyData].reverse();
  const revMaxValidIndex = revFrequencyData.findIndex((x) => x > 0);
  const maxValidIndex = frequencyBinCount - revMaxValidIndex - 1;
  if (
    maxValidIndex !== frequencyBinCount &&
    (validFrequencyBand.max === null || validFrequencyBand.max < maxValidIndex)
  ) {
    validFrequencyBand.max = maxValidIndex;
  }
};

export const generateValidFrequencyData = (
  frequencyData,
  validFrequencyBand
) => {
  if (validFrequencyBand.min === null || validFrequencyBand.max === null) {
    return [...frequencyData];
  } else {
    return frequencyData.slice(
      validFrequencyBand.min,
      validFrequencyBand.max + 1
    );
  }
};

export const calcHeight = (rate) => {
  const height = rate * 1.5;
  return height < 0.1 ? 0.1 : height;
};

export const calcColor = (rate) => {
  // 0 = blue < sky blue < green < yellow < orange < red = 1
  const hue = (1 - rate) * 240;
  const saturation = 50;
  const lightness = 50;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export const simplifiedGSS = (n) => {
  /*
   * Note: Inspired by
   *       - Yamaji, Atsushi.
   *         "GSS Generator: A Software to Distribute Many Points with Equal Intervals on an Unit Sphere."
   *         Geoinformatics 12.1 (2001): 3-12. (Japanese)
   */
  let prevPhi = 0;
  return [...Array(n).keys()].map((i) => {
    const h = (2 * i) / (n - 1) - 1;
    const theta = Math.acos(h);
    let phi;
    phi = i === 0 ? 0 : prevPhi + 3.6 / Math.sqrt(n * (1 - h * h));
    phi = isFinite(phi) ? phi : 0;
    prevPhi = phi;

    const x = Math.sin(theta) * Math.cos(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(theta);
    return new AFRAME.THREE.Vector3(x, y, z);
  });
};

export const visibleVectorFilter = (vector, position, eyeLevel) => {
  const normalVector = new AFRAME.THREE.Vector3(
    position.x,
    position.y - eyeLevel,
    position.z
  ).normalize();

  const a = normalVector.x;
  const b = normalVector.y;
  const c = normalVector.z;
  const d = 0.5;

  const x = vector.x;
  const y = vector.y;
  const z = vector.z;

  return a * x + b * y + c * z - d * d <= 0;
};
