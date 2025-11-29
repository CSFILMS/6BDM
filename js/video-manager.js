/**
 * Video Manager
 * Handles video playback, preloading, and video-related UI elements
 *
 * NOTE: Mobile/desktop detection logic could be simplified and centralized
 * Consider extracting device detection to a separate utility module
 */

import { isMobile, videoSources } from "./constants.js";

export class VideoManager {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.videoStartTime = null;
    this.videoPreloadState = {
      "bg-video3": false,
    };
  }

  /**
   * Initialize video source based on device type
   */
  initVideoSource() {
    const video = document.getElementById("bg-video3");
    const videoSource = document.getElementById("video-source");

    if (video && videoSource) {
      if (isMobile()) {
        videoSource.src = videoSources.mobile;
        console.log("📱 Loading mobile-optimized video");
      } else {
        videoSource.src = videoSources.desktop;
        console.log("🖥️ Loading desktop video");
      }

      video.load();
    }
  }

  /**
   * Preload video for better performance
   */
  preloadVideo(videoId) {
    const video = document.getElementById(videoId);
    if (!video || this.videoPreloadState[videoId]) return;

    console.log(`🎬 Preloading ${videoId}...`);
    video.preload = "metadata";
    video.load();

    video.addEventListener(
      "canplay",
      () => {
        console.log(`✅ ${videoId} preloaded successfully`);
        this.videoPreloadState[videoId] = true;
      },
      { once: true }
    );
  }

  /**
   * Show video background on slide 3
   * ================== MOBILE STABILITY ZONE ==================
   * This video reset is critical for mobile stability
   * DO NOT CHANGE - MOBILE DEPENDS ON THIS EXACT BEHAVIOR
   */
  showVideo3Background() {
    console.log("🎬 Showing video slide...");
    const videoContainer = document.getElementById("video-container");
    const video = document.getElementById("bg-video3");
    const playButton = document.getElementById("video-play-button");
    const textOverlay = document.getElementById("video-text-overlay");
    const textScanlines = document.getElementById("video-text-scanlines");
    const nav = document.getElementById("nav");
    const slideCounter = document.getElementById("slide-counter");

    this.videoStartTime = null;

    // ================== MOBILE STABILITY ZONE - DO NOT MODIFY ==================
    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      console.log("🔄 Video reset to beginning on slide entry");
    }
    // ================== END MOBILE STABILITY ZONE ==================

    if (nav) {
      console.log("🔍 Nav element found:", nav);
      nav.style.display = "flex";
      nav.style.visibility = "visible";
      console.log("✅ Nav forced visible");
    } else {
      console.log("❌ Nav element not found!");
    }

    if (slideCounter) {
      console.log("🔍 Slide counter found:", slideCounter);
      slideCounter.style.display = "block";
      slideCounter.style.visibility = "visible";
      console.log("✅ Slide counter forced visible");
    } else {
      console.log("❌ Slide counter element not found!");
    }

    if (videoContainer) {
      videoContainer.style.setProperty("display", "block", "important");
      console.log("✅ Video container shown");
    }

    if (playButton) {
      playButton.style.display = "block";
      console.log("✅ Play button shown");
    }

    if (textOverlay) {
      textOverlay.style.setProperty("display", "block", "important");
      textOverlay.style.setProperty("visibility", "visible", "important");
      textOverlay.style.setProperty("opacity", "1", "important");
      console.log("✅ Video text overlay shown");
    }

    if (textScanlines) {
      textScanlines.style.display = "block";
      console.log("✅ Video text scanlines shown");
    }
  }

  /**
   * Play video and audio when play button is clicked
   * ================== MOBILE STABILITY ZONE ==================
   */
  playVideoAndAudio() {
    const video = document.getElementById("bg-video3");
    const playButton = document.getElementById("video-play-button");

    if (playButton) {
      playButton.style.display = "none";
    }

    if (video) {
      // ================== MOBILE STABILITY ZONE - DO NOT MODIFY ==================
      // CRITICAL: Reset video to beginning before playing
      video.currentTime = 0;
      console.log("🔄 Video reset to beginning (currentTime = 0)");

      video.muted = false;
      video.volume = 1.0;

      // Mobile-specific: Force video to load from beginning
      if (isMobile()) {
        console.log("📱 Mobile detected - forcing video reload from beginning");
        video.load();
        video.currentTime = 0;
      }

      console.log(
        "🔊 Playing video with built-in audio... Volume:",
        video.volume,
        "Muted:",
        video.muted
      );

      video.addEventListener(
        "ended",
        () => {
          console.log(
            "🎬 Video ended - freezing on last frame and showing 6BDM"
          );
          video.currentTime = video.duration - 0.01;
          video.pause();
          this.startVideoEndSubtitle();
        },
        { once: true }
      );

      video
        .play()
        .then(() => {
          video.currentTime = 0;
          console.log(
            "✅ Video playing with audio from time:",
            video.currentTime
          );
          this.videoStartTime = Date.now();
        })
        .catch((err) => {
          console.log("❌ Video play failed:", err.message);
        });
      // ================== END MOBILE STABILITY ZONE ==================
    }
  }

  /**
   * Start typing subtitle when video ends
   */
  startVideoEndSubtitle() {
    let subtitleEl = document.getElementById("video-end-subtitle");
    if (!subtitleEl) {
      subtitleEl = document.createElement("div");
      subtitleEl.id = "video-end-subtitle";
      const mobile = isMobile();
      subtitleEl.style.cssText = `
        position: fixed;
        top: calc(45% + 30vh);
        left: calc(42% - 35vh);
        color: var(--accent);
        font-family: var(--font-family);
        font-size: ${mobile ? "1.2rem" : "1.5rem"};
        text-align: left;
        z-index: 2147483648;
        pointer-events: none;
        white-space: pre-wrap;
        text-shadow: 0 0 2px var(--accent), 0 0 5px var(--accent);
      `;
      document.body.appendChild(subtitleEl);
    }

    const message = "6BDM:\nJULIAN ASSANGE AND THE PRICE OF TRUTH";

    const typingAudio = this.audioManager.playTypingAudio();

    let charIndex = 0;
    const typingInterval = setInterval(() => {
      if (charIndex < message.length) {
        const currentText = message.substring(0, charIndex + 1);
        const lines = currentText.split("\n");
        if (lines.length > 1) {
          subtitleEl.innerHTML =
            lines[0] +
            '<br><span style="font-size: 0.75em;">' +
            lines[1] +
            "</span>";
        } else {
          subtitleEl.textContent = currentText;
        }
        charIndex++;
      } else {
        clearInterval(typingInterval);
        if (typingAudio) {
          typingAudio.pause();
          typingAudio.currentTime = 0;
          console.log("🛑 Typing audio stopped - typing complete");
        }
      }
    }, 50);
  }

  /**
   * Hide video background
   */
  hideVideo3Background() {
    console.log("🛑 Hiding video...");
    const videoContainer = document.getElementById("video-container");
    const video = document.getElementById("bg-video3");
    const textOverlay = document.getElementById("video-text-overlay");
    const textScanlines = document.getElementById("video-text-scanlines");
    const playButton = document.getElementById("video-play-button");
    const videoEndSubtitle = document.getElementById("video-end-subtitle");

    if (videoContainer) {
      videoContainer.style.setProperty("display", "none", "important");
      console.log("✅ Video container hidden");
    }

    if (video) {
      // Add 1-second delay before pausing video
      setTimeout(() => {
        video.pause();
        video.currentTime = 0;
        console.log("🔇 Video stopped (after 1-second delay)");
      }, 1000);
    }

    // Hide play button
    if (playButton) {
      playButton.style.display = "none";
    }

    // Stop typing audio
    this.audioManager.stopTypingAudio();

    // Hide text overlay
    if (textOverlay) {
      textOverlay.style.setProperty("display", "none", "important");
      console.log("✅ Video text overlay hidden");
    }

    // Hide text scanlines
    if (textScanlines) {
      textScanlines.style.display = "none";
      console.log("✅ Video text scanlines hidden");
    }

    // Remove video end subtitle
    if (videoEndSubtitle) {
      videoEndSubtitle.remove();
      console.log("✅ Video end subtitle removed");
    }
  }

  /**
   * Get video start time (for navigation protection)
   */
  getVideoStartTime() {
    return this.videoStartTime;
  }

  /**
   * Reset video start time
   */
  resetVideoStartTime() {
    this.videoStartTime = null;
  }
}
