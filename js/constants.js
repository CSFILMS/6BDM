export const fullTextRaw = `
RECIPIENT: DORSEY.6BDM180925

EYES ONLY / NO FWD / 
NO DSTRO

SOURCE: CSF
FILE ID: 369-108-11







THE SIX BILLION DOLLAR
MAN


PRESS [F] FOR FULL SCREEN





 
 
 
 
              
 
      
 
         
 
 
 
     


6BDM: JULIAN ASSANGE AND THE PRICE OF TRUTH




2006: JULIAN ASSANGE BUILDS WIKILEAKS TO ENABLE WHISTLEBLOWERS TO INFORM THE PUBLIC.

2010: WIKILEAKS RELEASES LARGEST TROVE OF U.S. MILITARY SECRETS IN HISTORY, EXPOSING U.S. WAR CRIMES.

2012-2019: U.S. AUTHORITIES CHARGE ASSANGE WITH ESPIONAGE. HE TAKES ASYLUM IN ECUADORIAN EMBASSY, LONDON.




2019: ASSANGE IS IMPRISONED IN THE UK FOR FIVE YEARS. AWAITS EXTRADITION TO THE U.S TO FACE A FURTHER 175.

2024: U.S. SUDDENLY DROPS 17 OF ITS 18 COUNTS AGAINST ASSANGE, DISMISSES CASE. ASSANGE PLEADS GUILTY ONLY TO JOURNALISM AND RETURNS TO AUSTRALIA A FREE MAN.





IN 2025, THE SIX BILLION DOLLAR MAN WON THE CANNES FILM FESTIVAL AND THE FIRST-EVER GOLDEN GLOBE FOR DOCUMENTARY. BUT NO LEGACY MEDIA WILL TOUCH IT.
 
SO, LIKE WIKILEAKS, WE ARE TAKING THE FILM DIRECT TO THE PUBLIC. 

FOR THIS, WE NEED YOUR HELP. 






[TRAILER]


`;

export const fullText = fullTextRaw.toUpperCase();

export const pages = fullText
  .split(/\n{4,}/)
  .filter((page) => page.trim().length > 0);

export const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 .,'\"?!-—:;\n";

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
  videoAudio: "VIDEOS/AUDIOJOSE1_audio.m4a",
};

export const imageSources = {
  cannes: "PHOTOS/photo_cannes.png.jpeg",
  arrest: "PHOTOS/photo_arrest.webp",
  collateral: "PHOTOS/photo_collateral_crop.jpg",
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
  { family: 'Crisp, "Courier New", monospace', size: "1.2rem" },
];

export const zIndexLayers = {
  videoContainer: 2147483647,
  videoTextOverlay: 2147483648,
  videoTextScanlines: 2147483649,
  navScanlines: 2147483650,
  nav: 2147483648,
  slideCounter: 2147483649,
};

export const allowedAudioSlides = [2];
