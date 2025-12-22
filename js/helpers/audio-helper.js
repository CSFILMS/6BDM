/**
 * Audio Helper
 * Simplified audio utilities for the carousel
 */

import { audioConfig } from "../constants.js";

export class AudioHelper {
  constructor() {
    this.audioContext = null;
    this.audioEnabled = audioConfig.enabled;
    this.typingAudio = null;
    this.audioContextUnlocked = false;
  }

  /**
   * Initialize and unlock audio context on user interaction
   */
  unlockAudioContext() {
    if (!this.audioContextUnlocked) {
      if (!this.audioEnabled) {
        this.audioEnabled = true;
      }

      if (!this.audioContext) {
        try {
          this.audioContext = new (window.AudioContext ||
            window.webkitAudioContext)();
          if (this.audioContext.state === "suspended") {
            this.audioContext.resume().then(() => {
              this.audioContextUnlocked = true;
              console.log("✅ Audio context unlocked");
            });
          }
        } catch (e) {
          console.error("❌ Audio context creation failed:", e);
          this.audioEnabled = false;
        }
      }
    }
  }

  /**
   * Play unscramble/typing audio (looped)
   */
  playTypingAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      unscrambleAudioEl.volume = audioConfig.unscrambleVolume;
      unscrambleAudioEl.loop = true;
      unscrambleAudioEl.muted = false;

      console.log("🔊 Playing typing audio...");
      unscrambleAudioEl.play().catch((err) => {
        console.log("❌ Typing audio play failed:", err);
      });
    }
    return unscrambleAudioEl;
  }

  /**
   * Stop typing audio
   */
  stopTypingAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      unscrambleAudioEl.pause();
      unscrambleAudioEl.currentTime = 0;
    }

    if (this.typingAudio) {
      this.typingAudio.pause();
      this.typingAudio.currentTime = 0;
      this.typingAudio = null;
    }
  }

  /**
   * Restart typing audio from a random position (for each new line)
   * Starting at different points makes it feel less repetitive
   */
  restartTypingAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      // Start from a random position in the audio file
      const duration = unscrambleAudioEl.duration || 5;
      unscrambleAudioEl.currentTime = Math.random() * duration;
      unscrambleAudioEl.volume = audioConfig.unscrambleVolume;
      unscrambleAudioEl.loop = true;
      unscrambleAudioEl.muted = false;

      unscrambleAudioEl.play().catch((err) => {
        console.log("❌ Typing audio restart failed:", err);
      });
    }
    return unscrambleAudioEl;
  }

  /**
   * Pause typing audio (without resetting position)
   */
  pauseTypingAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      unscrambleAudioEl.pause();
    }
  }

  /**
   * Play video audio (no loop - plays once)
   */
  playVideoAudio() {
    const videoAudioEl = document.getElementById("video-audio");
    if (videoAudioEl) {
      videoAudioEl.volume = audioConfig.unscrambleVolume;
      videoAudioEl.loop = false; // No loop - plays once with the video
      videoAudioEl.muted = false;
      videoAudioEl.currentTime = 0;

      console.log("🔊 Playing video audio...");
      videoAudioEl.play().catch((err) => {
        console.log("❌ Video audio play failed:", err);
      });
    }
    return videoAudioEl;
  }

  /**
   * Stop video audio
   */
  stopVideoAudio() {
    const videoAudioEl = document.getElementById("video-audio");
    if (videoAudioEl) {
      videoAudioEl.pause();
      videoAudioEl.currentTime = 0;
    }
  }

  /**
   * Fade out video audio
   */
  fadeOutVideoAudio(duration = 1000) {
    const videoAudioEl = document.getElementById("video-audio");
    if (videoAudioEl && !videoAudioEl.paused) {
      const startVolume = videoAudioEl.volume;
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        videoAudioEl.volume = Math.max(0, startVolume - volumeStep * currentStep);
        
        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          videoAudioEl.pause();
          videoAudioEl.currentTime = 0;
          videoAudioEl.volume = startVolume; // Reset volume for next play
          console.log("🔇 Video audio faded out");
        }
      }, stepDuration);
    }
  }

  /**
   * Stop all audio elements
   */
  stopAllAudio() {
    document.querySelectorAll("audio, video").forEach((media) => {
      media.pause();
      media.currentTime = 0;
    });
    this.typingAudio = null;
  }

  /**
   * Mute all audio elements
   */
  muteAll() {
    document.querySelectorAll("audio, video").forEach((media) => {
      media.muted = true;
      media.volume = 0;
    });
  }
}
