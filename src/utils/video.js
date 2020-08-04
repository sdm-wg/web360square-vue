import Hls from "hls.js";

export const setupHls = (videoElement, playlistFile) => {
  if (Hls.isSupported()) {
    const hls = new Hls();

    hls.loadSource(playlistFile);
    hls.attachMedia(videoElement);
  } else if (videoElement.canPlayType("application/vnd.apple.mpegurl")) {
    videoElement.src = playlistFile;
    videoElement.load();
  }
};
