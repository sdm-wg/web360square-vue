import AFRAME from "aframe";

// Golden ratio
const g = (1 + Math.sqrt(5)) / 2;

// 32 spectrums
// * Vertex of regular icosahedron                        : 12 points
// * Center of gravity of each face of regular icosahedron: 20 points
const spectrumVectors = [
  // y = -g
  [1, -g, 0],
  [-1, -g, 0],
  // y = -(2g+1)/3
  [0, -(2 * g + 1) / 3, g / 3],
  [0, -(2 * g + 1) / 3, -g / 3],
  // y = -1
  [0, -1, g],
  [0, -1, -g],
  // y = -(g+1)/3
  [(g + 1) / 3, -(g + 1) / 3, (g + 1) / 3],
  [(g + 1) / 3, -(g + 1) / 3, -(g + 1) / 3],
  [-(g + 1) / 3, -(g + 1) / 3, -(g + 1) / 3],
  [-(g + 1) / 3, -(g + 1) / 3, (g + 1) / 3],
  // y = -g/3
  [(2 * g + 1) / 3, -g / 3, 0],
  [-(2 * g + 1) / 3, -g / 3, 0],
  // y = 0
  [g / 3, 0, (2 * g + 1) / 3],
  [g, 0, 1],
  [g, 0, -1],
  [g / 3, 0, -(2 * g + 1) / 3],
  [-g / 3, 0, -(2 * g + 1) / 3],
  [-g, 0, -1],
  [-g, 0, 1],
  [-g / 3, 0, (2 * g + 1) / 3],
  // y = g/3
  [(2 * g + 1) / 3, g / 3, 0],
  [-(2 * g + 1) / 3, g / 3, 0],
  // y = (g+1)/3
  [(g + 1) / 3, (g + 1) / 3, (g + 1) / 3],
  [(g + 1) / 3, (g + 1) / 3, -(g + 1) / 3],
  [-(g + 1) / 3, (g + 1) / 3, -(g + 1) / 3],
  [-(g + 1) / 3, (g + 1) / 3, (g + 1) / 3],
  // y = 1
  [0, 1, g],
  [0, 1, -g],
  // y = (2g+1)/3
  [0, (2 * g + 1) / 3, g / 3],
  [0, (2 * g + 1) / 3, -g / 3],
  // y = g
  [1, g, 0],
  [-1, g, 0],
];

// Normalize
for (const [i, v] of Object.entries(spectrumVectors)) {
  spectrumVectors[i] = new AFRAME.THREE.Vector3(...v).normalize();
}

export { spectrumVectors };