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
   * Play scramble audio (computer readout - very subtle)
   */
  playScrambleAudio() {
    const scrambleAudioEl = document.getElementById("scramble-audio");
    if (scrambleAudioEl) {
      scrambleAudioEl.volume = audioConfig.scrambleVolume;
      scrambleAudioEl.loop = true;
      scrambleAudioEl.muted = false;

      console.log("🔊 Playing scramble audio...");
      scrambleAudioEl.play().catch((err) => {
        console.log("❌ Scramble audio play failed:", err);
      });
    }
    return scrambleAudioEl;
  }

  /**
   * Stop scramble audio
   */
  stopScrambleAudio() {
    const scrambleAudioEl = document.getElementById("scramble-audio");
    if (scrambleAudioEl) {
      scrambleAudioEl.pause();
      scrambleAudioEl.currentTime = 0;
    }
  }

  /**
   * Play typing audio (looped)
   */
  playTypingAudio() {
    const typingAudioEl = document.getElementById("typing-audio");
    if (typingAudioEl) {
      typingAudioEl.volume = audioConfig.typingVolume;
      typingAudioEl.loop = true;
      typingAudioEl.muted = false;

      console.log("🔊 Playing typing audio...");
      typingAudioEl.play().catch((err) => {
        console.log("❌ Typing audio play failed:", err);
      });
    }
    return typingAudioEl;
  }

  /**
   * Stop typing audio
   */
  stopTypingAudio() {
    const typingAudioEl = document.getElementById("typing-audio");
    if (typingAudioEl) {
      typingAudioEl.pause();
      typingAudioEl.currentTime = 0;
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
    const typingAudioEl = document.getElementById("typing-audio");
    if (typingAudioEl) {
      // Start from a random position in the audio file
      const duration = typingAudioEl.duration || 5;
      typingAudioEl.currentTime = Math.random() * duration;
      typingAudioEl.volume = audioConfig.typingVolume;
      typingAudioEl.loop = true;
      typingAudioEl.muted = false;

      typingAudioEl.play().catch((err) => {
        console.log("❌ Typing audio restart failed:", err);
      });
    }
    return typingAudioEl;
  }

  /**
   * Pause typing audio (without resetting position)
   */
  pauseTypingAudio() {
    const typingAudioEl = document.getElementById("typing-audio");
    if (typingAudioEl) {
      typingAudioEl.pause();
    }
  }

  /**
   * Play video audio (no loop - plays once)
   */
  playVideoAudio() {
    const videoAudioEl = document.getElementById("video-audio");
    if (videoAudioEl) {
      videoAudioEl.volume = audioConfig.defaultVolume;
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
        videoAudioEl.volume = Math.max(
          0,
          startVolume - volumeStep * currentStep
        );

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
