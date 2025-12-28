/**
 * Slide 3 - Video Slide
 * Video de Assange con play button, texto overlay y audio
 */

import { isMobile, videoSources } from "../constants.js";

export class Slide3 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.videoStartTime = null;
    this.videoMinPlayTime = 2000; // 2 seconds minimum
    this.videoElement = null;
    this.needsUnmute = false;
    this.unmuteListener = null;
    this.volumeFadeInterval = null;
  }

  render() {
    return `
      <div class="slide-content" style="
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <!-- Video container -->
        <div id="slide-3-video-container" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #000;
        ">
          <video
            id="slide-3-video"
            playsinline
            preload="metadata"
            style="
              width: 100%;
              max-height: 100%;
              object-fit: contain;
              cursor: pointer;
              filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(3.0);
            "
          >
            <source id="slide-3-video-source" src="" type="video/mp4" />
          </video>
        </div>
        
        <!-- Text overlay -->
        <div id="slide-3-text-overlay" style="
          position: absolute;
          width: 100%;
          top: 60px;
          left: 50%;
          transform: translateX(-50%);
          color: rgb(102, 255, 102);
          font-family: Crisp, 'Courier New', monospace;
          font-size: 27.2px;
          text-align: center;
          z-index: 10;
          pointer-events: none;
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          display: none;
        ">
          A FILM BY EUGENE JARECKI
        </div>
        
        <!-- Play button (shown when paused) -->
        <div id="slide-3-play-button" style="
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 20;
          cursor: pointer;
          display: none;
          align-items: center;
          justify-content: center;
          padding: 60px;
          border-radius: 50%;
          background-color: rgba(0, 0, 0, 0.5);
          transition: background-color 0.2s ease;
          pointer-events: auto;
        ">
          <div style="
            width: 0;
            height: 0;
            border-left: 40px solid var(--fg);
            border-top: 25px solid transparent;
            border-bottom: 25px solid transparent;
            filter: drop-shadow(0 0 5px var(--fg)) drop-shadow(0 0 15px var(--fg)) blur(0.8px);
          "></div>
        </div>
        
        <!-- Video end subtitle -->
        <div id="slide-3-end-subtitle" style="
          position: absolute;
          bottom: 18%;
          left: 50%;
          transform: translateX(-50%);
          color: rgb(102, 255, 102);
          font-family: Crisp, 'Courier New', monospace;
          font-size: 1.05rem;
          text-align: center; 
          z-index: 10;
          pointer-events: none;
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          white-space: pre-line;
          width: 90%;
          height: 3.6em;
          line-height: 1.8;
          display: none;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 3 (Video)");

    // Hide scanlines for video slide
    document.body.classList.add("video-slide-active");

    // Initialize video source
    const video = document.getElementById("slide-3-video");
    this.videoElement = video;
    const videoSource = document.getElementById("slide-3-video-source");
    const videoContainer = document.getElementById("slide-3-video-container");

    // Reset video container opacity (in case we're re-entering after fade out)
    if (videoContainer) {
      videoContainer.style.opacity = "1";
      videoContainer.style.transition = "";
    }

    if (video && videoSource) {
      videoSource.src = isMobile() ? videoSources.mobile : videoSources.desktop;
      video.load();
      video.muted = true; // Start muted for autoplay compatibility
      video.currentTime = 0;
      video.volume = 0.6;
      console.log("📱 Video source set:", videoSource.src);
    }

    // Start alien audio with fade in (creates atmosphere before video)
    this.audioHelper.playAlienAudio(1500);

    // Keep text overlays hidden initially
    const textOverlay = document.getElementById("slide-3-text-overlay");
    if (textOverlay) {
      textOverlay.style.display = "none";
      textOverlay.textContent = ""; // Clear content
    }

    const endSubtitle = document.getElementById("slide-3-end-subtitle");
    if (endSubtitle) {
      endSubtitle.style.display = "none";
      endSubtitle.innerHTML = ""; // Clear content
    }

    // Setup play button (hidden initially)
    const playButton = document.getElementById("slide-3-play-button");
    if (playButton) {
      playButton.style.display = "none";
      playButton.onclick = () => this.resumeVideo();
    }

    // Setup video click to pause/play
    if (video) {
      video.onclick = () => this.toggleVideo();
    }

    // Reset flags
    this.videoStartTime = null;
    this.needsUnmute = false;

    // Setup global click listener to unmute
    this.setupUnmuteListener();

    // Autoplay video after a short delay
    setTimeout(() => {
      this.playVideoWithSound();
    }, 300);
  }

  setupUnmuteListener() {
    // Remove existing listener if any
    if (this.unmuteListener) {
      document.removeEventListener("click", this.unmuteListener, true);
    }

    // Create new listener
    this.unmuteListener = () => {
      if (this.needsUnmute && this.videoElement) {
        // Unmute the video's own audio
        this.videoElement.muted = false;
        this.videoElement.volume = 1.0;
        this.needsUnmute = false;

        // Hide unmute button
        const playButton = document.getElementById("slide-3-play-button");
        if (playButton) {
          playButton.style.display = "none";
        }

        console.log("🔊 Video audio unmuted!");

        // Remove listener after unmuting
        document.removeEventListener("click", this.unmuteListener, true);
        this.unmuteListener = null;
      }
    };

    // Add listener with capture phase
    document.addEventListener("click", this.unmuteListener, true);
  }

  async playVideoWithSound() {
    console.log("▶️ Attempting autoplay with sound...");

    const video = this.videoElement || document.getElementById("slide-3-video");
    const playButton = document.getElementById("slide-3-play-button");

    if (!video) {
      console.error("❌ Video element not found");
      return;
    }

    if (playButton) {
      playButton.style.display = "none";
    }

    // Reset to beginning
    video.currentTime = 0;
    video.volume = 0.6;

    // Mobile-specific: Force reload
    if (isMobile()) {
      video.load();
      video.currentTime = 0;
    }

    // Handle video end - fade out video and audio
    video.addEventListener(
      "ended",
      () => {
        console.log("🎬 Video ended - starting fade out");
        this.fadeOutVideo();
      },
      { once: true }
    );

    // Try unmuted first
    video.muted = false;

    try {
      await video.play();
      // Success with sound!
      if (this.videoStartTime === null) {
        this.videoStartTime = Date.now();
      }
      console.log("✅ Video playing WITH SOUND (using video's own audio)");
      console.log("🔊 Muted:", video.muted, "Volume:", video.volume);
      this.needsUnmute = false;

      // Fade out alien audio
      this.audioHelper.fadeOutAlienAudio(2000);
    } catch (err) {
      // Autoplay with sound failed, try muted
      console.warn(
        "⚠️ Autoplay with sound blocked, playing muted:",
        err.message
      );

      video.muted = true;
      this.needsUnmute = true;

      try {
        await video.play();
        console.log("⚠️ Video playing MUTED - any click will unmute");

        // Fade out alien audio (video is playing even if muted)
        this.audioHelper.fadeOutAlienAudio(2000);

        if (playButton) {
          playButton.style.display = "flex";
          playButton.innerHTML = `
            <div style="
              color: rgb(102, 255, 102);
              font-family: Crisp, 'Courier New', monospace;
              font-size: 1.05rem;
              text-align: center;
              text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
              filter: saturate(0.95);
              line-height: 1.4;
            ">🔊 CLICK ANYWHERE<br>TO HEAR AUDIO</div>
          `;
        }

        if (this.videoStartTime === null) {
          this.videoStartTime = Date.now();
        }
      } catch (err2) {
        console.error("❌ Video play completely failed:", err2);
        if (playButton) {
          playButton.style.display = "flex";
          playButton.innerHTML = `
            <div style="
              color: rgb(102, 255, 102);
              font-family: Crisp, 'Courier New', monospace;
              font-size: 19.2px;
              text-align: center;
              text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
              filter: saturate(0.95);
            ">▶️<br>CLICK TO PLAY</div>
          `;
          playButton.onclick = () => {
            video.muted = false;
            video.volume = 0.6;
            video.play().then(() => {
              playButton.style.display = "none";
              if (this.videoStartTime === null) {
                this.videoStartTime = Date.now();
              }
              // Fade out alien audio
              this.audioHelper.fadeOutAlienAudio(2000);
            });
          };
        }
      }
    }
  }

  playVideo() {
    this.playVideoWithSound();
  }

  resumeVideo() {
    console.log("▶️ Resuming video");

    const video = document.getElementById("slide-3-video");
    const playButton = document.getElementById("slide-3-play-button");

    if (playButton) {
      playButton.style.display = "none";
    }

    if (video) {
      video
        .play()
        .then(() => {
          console.log("✅ Video resumed");
        })
        .catch((err) => {
          console.error("❌ Video resume failed:", err);
        });
    }
  }

  toggleVideo() {
    console.log("⏯️ Toggling video");

    const video = document.getElementById("slide-3-video");
    const playButton = document.getElementById("slide-3-play-button");

    if (video) {
      if (video.paused) {
        // Resume playback
        this.resumeVideo();
      } else {
        // Pause video (audio is part of video)
        video.pause();
        if (playButton) {
          playButton.style.display = "flex";
        }
        console.log("⏸️ Video paused");
      }
    }
  }

  fadeOutVideo() {
    const video = document.getElementById("slide-3-video");
    const videoContainer = document.getElementById("slide-3-video-container");

    if (!video) return;

    // Keep video on last frame
    video.currentTime = video.duration - 0.01;
    video.pause();

    // Fade out the video's audio
    this.fadeOutVideoVolume(video, 1500);

    // Fade out the video visually
    if (videoContainer) {
      videoContainer.style.transition = "opacity 1.5s ease-out";
      videoContainer.style.opacity = "0";
      console.log("🎬 Video fading out...");
    }

    // Start text animations after video ends
    this.animateTopText();
  }

  /**
   * Fade out video volume gradually
   */
  fadeOutVideoVolume(video, duration = 1500) {
    if (!video) return;

    // Clear any existing fade
    if (this.volumeFadeInterval) {
      clearInterval(this.volumeFadeInterval);
    }

    const startVolume = video.volume;
    const steps = 20;
    const stepDuration = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    console.log("🔇 Fading out video audio...");
    this.volumeFadeInterval = setInterval(() => {
      currentStep++;
      video.volume = Math.max(0, startVolume - volumeStep * currentStep);

      if (currentStep >= steps) {
        clearInterval(this.volumeFadeInterval);
        this.volumeFadeInterval = null;
        video.volume = 0;
        console.log("🔇 Video audio faded out");
      }
    }, stepDuration);
  }

  animateTopText() {
    console.log("✨ Animating top text");

    const textOverlay = document.getElementById("slide-3-text-overlay");
    if (!textOverlay) return;

    const message = "A FILM BY EUGENE JARECKI";

    // Show element
    textOverlay.style.display = "block";
    textOverlay.textContent = "";

    // Play scramble audio
    this.audioHelper.playScrambleAudio();

    // Use scramble effect (decodification) with slower, smoother animation
    this.animationHelper.scrambleText(
      textOverlay,
      message,
      () => {
        // Stop audio when animation completes
        this.audioHelper.stopScrambleAudio();
        console.log("✅ Top text animation complete");

        // Start bottom text animation after a delay
        setTimeout(() => {
          this.animateBottomText();
        }, 1000);
      },
      false,
      {
        chunkSize: 3, // Reveal fewer characters per step (more gradual)
        intervalMs: 80, // Slightly faster interval for smoothness
      }
    );
  }

  animateBottomText() {
    console.log("✨ Animating bottom text");

    const subtitleEl = document.getElementById("slide-3-end-subtitle");
    if (!subtitleEl) return;

    subtitleEl.style.display = "block";
    subtitleEl.innerHTML = "";

    const message = "6BDM:\nJULIAN ASSANGE AND THE PRICE OF TRUTH";

    // Play scramble audio
    this.audioHelper.playScrambleAudio();

    // Use scramble effect (decodification) with slower, smoother animation
    this.animationHelper.scrambleText(
      subtitleEl,
      message,
      () => {
        // Stop audio when animation completes
        this.audioHelper.stopScrambleAudio();
        console.log("✅ Bottom text animation complete");
      },
      false,
      {
        chunkSize: 3, // Reveal fewer characters per step (more gradual)
        intervalMs: 80, // Slightly faster interval for smoothness
      }
    );
  }

  canNavigateNext() {
    // Block navigation if video hasn't been played or hasn't played for minimum time
    if (this.videoStartTime === null) {
      console.log("🚫 Video not started yet");
      return false;
    }

    const elapsed = Date.now() - this.videoStartTime;
    if (elapsed < this.videoMinPlayTime) {
      console.log(
        `🚫 Video only played ${elapsed}ms, need ${this.videoMinPlayTime}ms`
      );
      return false;
    }

    return true;
  }

  onExit() {
    console.log("🚪 Exiting Slide 3");

    // Show scanlines again
    document.body.classList.remove("video-slide-active");

    // Remove unmute listener
    if (this.unmuteListener) {
      document.removeEventListener("click", this.unmuteListener, true);
      this.unmuteListener = null;
    }

    // Clear volume fade interval
    if (this.volumeFadeInterval) {
      clearInterval(this.volumeFadeInterval);
      this.volumeFadeInterval = null;
    }

    // Stop video and reset container
    const video = document.getElementById("slide-3-video");
    const videoContainer = document.getElementById("slide-3-video-container");

    if (video) {
      video.pause();
      video.currentTime = 0;
      video.muted = true;
      video.volume = 0.6; // Reset volume for next time
    }

    // Reset container opacity for next time
    if (videoContainer) {
      videoContainer.style.opacity = "1";
      videoContainer.style.transition = "";
    }

    // Stop other audio using helper
    this.audioHelper.stopAlienAudio();
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();

    // Hide and clear text overlays
    const textOverlay = document.getElementById("slide-3-text-overlay");
    if (textOverlay) {
      textOverlay.style.display = "none";
      textOverlay.textContent = "";
    }

    const endSubtitle = document.getElementById("slide-3-end-subtitle");
    if (endSubtitle) {
      endSubtitle.style.display = "none";
      endSubtitle.innerHTML = "";
    }

    // Reset flags
    this.needsUnmute = false;
    this.videoElement = null;
  }

  cleanup() {
    // Show scanlines again
    document.body.classList.remove("video-slide-active");

    // Remove unmute listener
    if (this.unmuteListener) {
      document.removeEventListener("click", this.unmuteListener, true);
      this.unmuteListener = null;
    }

    // Clear volume fade interval
    if (this.volumeFadeInterval) {
      clearInterval(this.volumeFadeInterval);
      this.volumeFadeInterval = null;
    }

    const video = document.getElementById("slide-3-video");
    if (video) {
      video.pause();
      video.src = "";
      video.volume = 0.6;
    }

    this.audioHelper.stopAlienAudio();
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();

    this.needsUnmute = false;
    this.videoElement = null;
  }
}
