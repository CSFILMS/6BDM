export const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789.,'\"?!-:;";

export const audioConfig = {
  enabled: true,
  defaultVolume: 0.67,
  debugMode: true,
  unscrambleVolume: 0.3,
  typingVolume: 0.3,
};

export const animationConfig = {
  scrambleChunkSize: 15,
  scrambleIntervalMs: 100,
  ultraFastScrambleIntervalMs: 25,
  typewriterCharDelayMs: 50,
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
  mobile: "VIDEOS/FADELONG_mobile.mp4?v=13",
  desktop: "VIDEOS/FADELONG.mp4?v=13",
};

export const audioSources = {
  text: "TEXTAUDIO.mp4",
  unscramble: "VIDEOS/speduptyping.wav",
};

export const imageSources = {
  arrest: "PHOTOS/photo_arrest.webp",
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
  color: "rgb(0, 221, 0)",
  textShadow:
    "0px 0px 2px rgb(0, 221, 0), 0px 0px 8px rgb(0, 221, 0), 0px 0px 16px rgb(0, 221, 0)",
  filter: "saturate(1.3)",
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
