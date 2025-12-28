export const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'\"?!-:;";

export const audioConfig = {
  enabled: true,
  defaultVolume: 0.1,
  debugMode: true,
  scrambleVolume: 0.03,
  typingVolume: 0.1,
  alienVolume: 0.08,
};

export const animationConfig = {
  scrambleChunkSize: 8,
  scrambleIntervalMs: 40,
  ultraFastScrambleIntervalMs: 10,
  typewriterCharDelayMs: 15,
  slideTransitionDurationMs: 250,
};

export const timingConfig = {
  navigationThrottleMs: 600,
  videoMinPlayTimeSeconds: 2,
  videoHideDelayMs: 1000,
};

export const isMobile = () => {
  return (
    window.innerWidth <= 768 ||
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    )
  );
};

export const videoSources = {
  mobile: "VIDEOS/video.mp4",
  desktop: "VIDEOS/video.mp4",
};

export const audioSources = {
  text: "TEXTAUDIO.mp4",
  scramble: "audio/ComputerReadout-1.wav",
  typing: "audio/speduptyping.wav",
};

export const imageSources = {
  arrest: "PHOTOS/photo_arrest.webp",
  first_correa: "PHOTOS/correa.jpeg",
  correa: "PHOTOS/photo_correa.jpg",
};

export const slideConfig = {
  // Slide 1 (index 0): Title slide
  0: {
    displayMode: "instant",
    hasImage: false,
  },
  // Slide 2 (index 1): Content slide with scramble
  1: {
    displayMode: "scramble",
    hasImage: false,
    showSpacebarPrompt: true,
  },
  // Slide 3 (index 2): Video slide
  2: {
    displayMode: "video",
    hasImage: false,
    isVideoSlide: true,
  },
  // Slide 4 (index 3): Correa photo
  3: {
    displayMode: "scramble",
    hasImage: true,
    imageType: "correa",
  },
  // Slide 5 (index 4): Arrest photo
  4: {
    displayMode: "scramble",
    hasImage: true,
    imageType: "arrest",
  },
};

// Color schemes
export const colors = {
  schemes: ["#CCCCCC", "#00DD00", "#66FF66"],
  defaultIndex: 1,
};

export const fonts = [
  { family: 'Crisp, "Courier New", monospace', size: "1.05rem" },
];

// Global text style
export const textStyle = {
  color: "rgb(102, 255, 102)",
  textShadow:
    "0px 0px 2px rgb(102, 255, 102), 0px 0px 8px rgb(102, 255, 102), 0px 0px 16px rgb(102, 255, 102)",
  filter: "saturate(0.95)",
  fontSize: "1.05rem",
  fontFamily: 'Crisp, "Courier New", monospace',
};

export const zIndexLayers = {
  videoContainer: 2147483647,
  videoTextOverlay: 2147483648,
  videoTextScanlines: 2147483649,
  navScanlines: 2147483650,
  nav: 2147483648,
  slideCounter: 2147483649,
};

export const allowedAudioSlides = [2];
