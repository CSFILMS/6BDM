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
   * Restart typing audio from the beginning (for each new line)
   */
  restartTypingAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      unscrambleAudioEl.currentTime = 0;
      unscrambleAudioEl.volume = audioConfig.unscrambleVolume;
      unscrambleAudioEl.loop = true;
      unscrambleAudioEl.muted = false;

      console.log("🔊 Restarting typing audio for new line...");
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
   * Play video audio
   */
  playVideoAudio() {
    const videoAudioEl = document.getElementById("video-audio");
    if (videoAudioEl) {
      videoAudioEl.volume = audioConfig.unscrambleVolume;
      videoAudioEl.loop = true;
      videoAudioEl.muted = false;

      console.log("🔊 Playing typing audio...");
      videoAudioEl.play().catch((err) => {
        console.log("❌ Typing audio play failed:", err);
      });
    }
    return videoAudioEl;
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
