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

export const looseSync = (videoElement, currentTime) => {
  // HACK: Synchronize "loosely" by changing the video playback speed
  const videoCurrentTime = videoElement.currentTime;
  const threshold = 0.1;

  if (currentTime - videoCurrentTime > threshold) {
    // If the video is lagging behind the audio, the video playback speed is doubled
    videoElement.playbackRate = 2;
  } else if (videoCurrentTime - currentTime > threshold) {
    // If the video is ahead of the audio, the video playback speed is halved
    videoElement.playbackRate = 0.5;
  } else {
    videoElement.playbackRate = 1;
  }
};

export const forceSync = (videoElement, currentTime) => {
  videoElement.currentTime = currentTime;
};

export const calcBufferedRates = (videoElement, duration) => {
  const buffered = videoElement.buffered;
  return [...Array(buffered.length).keys()].map((i) => {
    let startRate;
    startRate = buffered.start(i) / duration;
    startRate = startRate > 1 ? 1 : startRate;
    let endRate;
    endRate = buffered.end(i) / duration;
    endRate = endRate > 1 ? 1 : endRate;
    return { start: startRate, end: endRate };
  });
};
