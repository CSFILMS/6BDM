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
   * Starts from a random position in the first half of the audio
   */
  playScrambleAudio() {
    const scrambleAudioEl = document.getElementById("scramble-audio");
    if (scrambleAudioEl) {
      // Start from a random position in the first half of the audio
      scrambleAudioEl.currentTime = 2;

      scrambleAudioEl.volume = audioConfig.scrambleVolume;
      scrambleAudioEl.loop = true;
      scrambleAudioEl.muted = false;

      console.log(
        "🔊 Playing scramble audio from:",
        scrambleAudioEl.currentTime.toFixed(2) + "s"
      );
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
   * Play alien audio with fade in (for slide-3 intro)
   */
  playAlienAudio(fadeInDuration = 1500) {
    const alienAudioEl = document.getElementById("alien-audio");
    if (alienAudioEl) {
      // Start from second 2
      alienAudioEl.currentTime = 0;

      // Start at volume 0 for fade in
      alienAudioEl.volume = 0;
      alienAudioEl.loop = true;
      alienAudioEl.muted = false;

      console.log("🔊 Playing alien audio with fade in...");
      alienAudioEl.play().catch((err) => {
        console.log("❌ Alien audio play failed:", err);
      });

      // Fade in
      const targetVolume = audioConfig.alienVolume;
      const steps = 30;
      const stepDuration = fadeInDuration / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;

      const fadeInterval = setInterval(() => {
        currentStep++;
        alienAudioEl.volume = Math.min(targetVolume, volumeStep * currentStep);

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          alienAudioEl.volume = targetVolume;
          console.log("🔊 Alien audio fade in complete");
        }
      }, stepDuration);
    }
    return alienAudioEl;
  }

  /**
   * Fade out alien audio - slow and smooth
   */
  fadeOutAlienAudio(duration = 4000) {
    const alienAudioEl = document.getElementById("alien-audio");
    if (alienAudioEl && !alienAudioEl.paused) {
      const startVolume = alienAudioEl.volume;
      const steps = 60; // More steps for smoother fade
      const stepDuration = duration / steps;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      console.log("🔇 Fading out alien audio (slow)...");
      const fadeInterval = setInterval(() => {
        currentStep++;
        // Use easing for smoother fade (ease-out curve)
        const progress = currentStep / steps;
        const easedProgress = 1 - Math.pow(1 - progress, 2);
        alienAudioEl.volume = Math.max(0, startVolume * (1 - easedProgress));

        if (currentStep >= steps) {
          clearInterval(fadeInterval);
          alienAudioEl.pause();
          alienAudioEl.currentTime = 0;
          alienAudioEl.volume = audioConfig.alienVolume; // Reset for next time
          console.log("🔇 Alien audio faded out");
        }
      }, stepDuration);
    }
  }

  /**
   * Stop alien audio immediately
   */
  stopAlienAudio() {
    const alienAudioEl = document.getElementById("alien-audio");
    if (alienAudioEl) {
      alienAudioEl.pause();
      alienAudioEl.currentTime = 0;
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
