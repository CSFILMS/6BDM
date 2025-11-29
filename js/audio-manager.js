/**
 * Audio Manager
 * Handles all audio playback, context initialization, and audio element management
 *
 * NOTE: Consider migrating to modern Web Audio API instead of <audio> elements
 * for better control and performance. Current implementation uses legacy approach
 * for compatibility but could benefit from modernization.
 */

import { audioConfig } from "./constants.js";

export class AudioManager {
  constructor() {
    this.audioContext = null;
    this.audioEnabled = audioConfig.enabled;
    this.debugMode = audioConfig.debugMode;
    this.currentAudio = null;
    this.audioVolume = audioConfig.defaultVolume;
    this.typingAudio = null;
    this.audioContextUnlocked = false;
  }

  /**
   * Initialize audio context (required for Web Audio API)
   */
  initAudioContext() {
    if (this.debugMode) console.log("🔊 Initializing audio context...");

    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        console.log(
          "✅ Audio context created successfully:",
          this.audioContext.state
        );

        // Resume audio context if suspended (required by Chrome)
        if (this.audioContext.state === "suspended") {
          this.audioContext
            .resume()
            .then(() => {
              console.log("✅ Audio context resumed from suspended state");
            })
            .catch((err) => {
              console.error("❌ Failed to resume audio context:", err);
            });
        }
      } catch (e) {
        console.error("❌ Audio context creation failed:", e);
        this.audioEnabled = false;
        this.showAudioError("Audio not supported in this browser");
      }
    }
    return this.audioContext !== null;
  }

  /**
   * Unlock audio context on user interaction (required by browsers)
   */
  unlockAudioContext() {
    if (!this.audioContextUnlocked) {
      console.log("🔓 Unlocking audio context...");

      // Enable audio if not already enabled
      if (!this.audioEnabled) {
        this.audioEnabled = true;
        console.log("🔊 Audio enabled on first interaction");
      }

      // Initialize audio context first
      this.initAudioContext();

      if (this.audioContext && this.audioContext.state === "suspended") {
        this.audioContext
          .resume()
          .then(() => {
            this.audioContextUnlocked = true;
            console.log("✅ Audio context unlocked via resume");
          })
          .catch((resumeErr) => {
            console.log("❌ Audio context resume failed:", resumeErr.message);
          });
      }
    }
  }

  /**
   * Stop any currently playing audio
   */
  stopCurrentAudio() {
    if (this.currentAudio) {
      console.log("🛑 Stopping current audio...");
      this.currentAudio.pause();
      this.currentAudio.currentTime = 0;
      this.currentAudio.src = ""; // Clear the source
      this.currentAudio.load(); // Reset the audio element
      this.currentAudio = null;
    }

    // Also stop any other audio elements that might be playing
    const allAudioElements = document.querySelectorAll("audio");
    allAudioElements.forEach((audio) => {
      if (!audio.paused) {
        audio.pause();
        audio.currentTime = 0;
      }
    });
  }

  /**
   * Stop typing audio specifically
   */
  stopTypingAudio() {
    if (this.typingAudio) {
      this.typingAudio.pause();
      this.typingAudio.currentTime = 0;
      this.typingAudio = null;
      console.log("🔇 Typing audio stopped");
    }
  }

  /**
   * Play unscramble audio (typing sound during text reveal)
   */
  playUnscrambleAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      unscrambleAudioEl.volume = audioConfig.unscrambleVolume;
      unscrambleAudioEl.loop = true;
      unscrambleAudioEl.muted = false;

      console.log("🔊 Playing unscramble audio...");
      unscrambleAudioEl
        .play()
        .then(() => {
          console.log("✅ Unscramble audio playing");
        })
        .catch((err) => {
          console.log("❌ Unscramble audio play failed:", err);
        });
    }
  }

  /**
   * Stop unscramble audio
   */
  stopUnscrambleAudio() {
    const unscrambleAudioEl = document.getElementById("unscramble-audio");
    if (unscrambleAudioEl) {
      unscrambleAudioEl.pause();
      unscrambleAudioEl.currentTime = 0;
      console.log("🔇 Unscramble audio stopped");
    }
  }

  /**
   * Play typing audio for video end subtitle
   */
  playTypingAudio() {
    // Stop any existing typing audio
    if (this.typingAudio) {
      this.typingAudio.pause();
      this.typingAudio = null;
    }

    // Create a new audio instance for typing sound
    this.typingAudio = new Audio("VIDEOS/speduptyping.wav");
    this.typingAudio.volume = audioConfig.typingVolume;
    this.typingAudio.loop = true; // Loop during typing
    this.typingAudio.muted = false; // Ensure not muted

    // Play typing audio
    console.log(
      "🔊 Playing speduptyping.wav... Volume:",
      this.typingAudio.volume,
      "Muted:",
      this.typingAudio.muted
    );
    this.typingAudio
      .play()
      .then(() => {
        console.log(
          "✅ speduptyping.wav playing successfully - Volume:",
          this.typingAudio.volume,
          "Paused:",
          this.typingAudio.paused
        );
      })
      .catch((err) => {
        console.error("❌ speduptyping.wav play failed:", err.message);
      });

    return this.typingAudio;
  }

  /**
   * Show audio error in the UI
   */
  showAudioError(message) {
    const navMsg = document.getElementById("nav-msg");
    if (navMsg) {
      const originalText = navMsg.textContent;
      const originalVisibility = navMsg.style.visibility;

      navMsg.textContent = `AUDIO ERROR: ${message}`;
      navMsg.style.visibility = "visible";
      navMsg.style.color = "#FF6666";

      setTimeout(() => {
        navMsg.textContent = originalText;
        navMsg.style.visibility = originalVisibility;
        navMsg.style.color = "";
      }, 3000);
    }
  }

  /**
   * Set volume for current audio
   */
  setVolume(volume) {
    this.audioVolume = volume;
    if (this.currentAudio) {
      this.currentAudio.volume = volume;
    }
  }

  /**
   * Get current audio playback state
   */
  isPlaying() {
    return this.currentAudio && !this.currentAudio.paused;
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
