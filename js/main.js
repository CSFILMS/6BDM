/**
 * Main Application Entry Point
 * Simplified carousel-based architecture
 */

import { CarouselManager } from "./carousel-manager.js";
import { AudioHelper } from "./helpers/audio-helper.js";
import { AnimationHelper } from "./helpers/animation-helper.js";
import {
  Slide0,
  Slide1,
  Slide2,
  Slide3,
  Slide4,
  Slide5,
  Slide6,
  Slide7,
} from "./slides/index.js";

/**
 * Application class - main coordinator
 */
class Application {
  constructor() {
    // Initialize helpers
    this.audioHelper = new AudioHelper();
    this.animationHelper = new AnimationHelper();

    // Initialize slides with helpers
    this.slides = [
      new Slide0(this.audioHelper, this.animationHelper),
      new Slide1(this.audioHelper, this.animationHelper),
      new Slide2(this.audioHelper, this.animationHelper),
      new Slide3(this.audioHelper, this.animationHelper),
      new Slide4(this.audioHelper, this.animationHelper),
      new Slide5(this.audioHelper, this.animationHelper),
      new Slide6(this.audioHelper, this.animationHelper),
      new Slide7(this.audioHelper, this.animationHelper),
    ];

    console.log("🔍 DEBUG: Number of slides created:", this.slides.length);
    console.log("🔍 DEBUG: Slides array:", this.slides);

    // Initialize carousel
    this.carousel = new CarouselManager("#carousel-container", this.slides);

    console.log(
      "🚀 Application initialized with",
      this.slides.length,
      "slides"
    );
  }

  /**
   * Initialize the application
   */
  async init() {
    console.log("🔧 Starting application initialization...");

    // Mute all audio by default
    this.audioHelper.muteAll();

    // Initialize carousel
    this.carousel.init();

    // Initialize audio context for mobile devices
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      console.log("📱 Mobile device detected - preparing audio context");
      document.addEventListener(
        "click",
        () => {
          this.audioHelper.unlockAudioContext();
        },
        { once: true }
      );
    }

    console.log("✅ Application initialization complete");
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
