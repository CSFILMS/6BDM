/**
 * Main Application Entry Point
 * Coordinates all managers and initializes the application
 */

import { AudioManager } from "./audio-manager.js";
import { VideoManager } from "./video-manager.js";
import { AnimationManager } from "./animation-manager.js";
import { ImageManager } from "./image-manager.js";
import { NavigationManager } from "./navigation-manager.js";
import { UIManager } from "./ui-manager.js";

/**
 * Application class - main coordinator
 */
class Application {
  constructor() {
    // Initialize all managers
    this.audioManager = new AudioManager();
    this.videoManager = new VideoManager(this.audioManager);
    this.animationManager = new AnimationManager(this.audioManager);
    this.imageManager = new ImageManager();
    this.navigationManager = new NavigationManager(
      this.videoManager,
      this.animationManager,
      this.imageManager,
      this.audioManager
    );
    this.uiManager = new UIManager();

    console.log("🚀 Application initialized");
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log("🔧 Starting application initialization...");

    // Initialize video source based on device
    this.videoManager.initVideoSource();

    // Initialize UI components
    this.uiManager.initialize();

    // Setup video play button
    this.setupVideoPlayButton();

    // Setup navigation event listeners
    this.navigationManager.setupEventListeners();

    // Initialize audio context for mobile devices
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      console.log("📱 Mobile device detected - preparing audio context");
      this.audioManager.initAudioContext();
    }

    // Mute all audio by default
    this.audioManager.muteAll();

    // Start on first page
    this.navigationManager.startPage(0);

    console.log("✅ Application initialization complete");
  }

  /**
   * Setup video play button event listener
   */
  setupVideoPlayButton() {
    const playButton = document.getElementById("video-play-button");
    if (playButton) {
      playButton.addEventListener("click", (e) => {
        e.stopPropagation();
        e.preventDefault();
        this.videoManager.playVideoAndAudio();
      });
      console.log("✅ Play button click listener added");
    }
  }
}

/**
 * Initialize application when DOM is ready
 */
window.addEventListener("DOMContentLoaded", () => {
  console.log("📄 DOM Content Loaded");
  const app = new Application();
  app.init();
});

/**
 * Cache bust logging
 */
console.log("🔄 Script reloaded - cache bust");
console.log("📦 ES6 Modules loaded successfully");
