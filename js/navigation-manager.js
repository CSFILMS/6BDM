/**
 * Navigation Manager
 * Handles slide navigation, page transitions, and user input
 *
 * NOTE: UI logic and navigation logic are currently mixed.
 * Consider separating UI updates (nav messages, slide counter) into UIManager
 * and keeping only navigation state/logic here for better separation of concerns.
 */

import { pages, timingConfig, animationConfig, isMobile } from "./constants.js";

export class NavigationManager {
  constructor(videoManager, animationManager, imageManager, audioManager) {
    this.videoManager = videoManager;
    this.animationManager = animationManager;
    this.imageManager = imageManager;
    this.audioManager = audioManager;

    this.currentPage = 0;
    this.isNavigating = false;
    this.lastAdvance = 0;
    this.lineRevealTimeouts = [];
    this.filmByTimeouts = [];
  }

  /**
   * Throttle navigation to prevent rapid page changes
   */
  throttle() {
    const now = Date.now();
    if (now - this.lastAdvance < timingConfig.navigationThrottleMs)
      return false;
    this.lastAdvance = now;
    return true;
  }

  /**
   * Safely advance to next slide with video protection
   */
  safeAdvance() {
    if (!this.throttle() || this.isNavigating) return;

    // Check if we're on the video slide (slide 3, index 2)
    if (this.currentPage === 2) {
      const videoStartTime = this.videoManager.getVideoStartTime();
      if (videoStartTime === null) {
        console.log(
          `🎬 Video slide protection: Video not started yet - click play button first`
        );
        return; // Block navigation if video hasn't been played
      }

      const currentTime = Date.now();
      const videoPlayTime = (currentTime - videoStartTime) / 1000; // Convert to seconds

      if (videoPlayTime < timingConfig.videoMinPlayTimeSeconds) {
        console.log(
          `🎬 Video slide protection: Only ${videoPlayTime.toFixed(
            1
          )}s played, need 2s to advance`
        );
        return; // Block navigation
      }
    }

    this.audioManager.unlockAudioContext();
    this.isNavigating = true;
    this.startPage(this.currentPage + 1);
    setTimeout(() => {
      this.isNavigating = false;
    }, timingConfig.navigationThrottleMs);
  }

  /**
   * Go back to previous slide
   */
  goBack() {
    if (!this.throttle() || this.isNavigating) return;
    this.audioManager.unlockAudioContext();
    this.isNavigating = true;
    this.startPage(this.currentPage - 1);
    setTimeout(() => {
      this.isNavigating = false;
    }, timingConfig.navigationThrottleMs);
  }

  /**
   * Start displaying a specific page
   */
  startPage(pageIndex) {
    if (pageIndex >= pages.length) pageIndex = 0;
    if (pageIndex < 0) pageIndex = pages.length - 1;

    const pageEl = document.getElementById("page");
    const el = document.getElementById("unscramble");
    const promptElem = document.getElementById("prompt");

    // Only animate if not first load
    if (this.currentPage !== null && this.currentPage !== pageIndex) {
      // Determine direction (forward or backward)
      const goingForward = pageIndex > this.currentPage;

      // Remove all animation classes
      pageEl.classList.remove(
        "slide-in-right",
        "slide-in-left",
        "slide-out-left",
        "slide-out-right"
      );

      // Trigger slide-out animation based on direction
      if (goingForward) {
        pageEl.classList.add("slide-out-left");
      } else {
        pageEl.classList.add("slide-out-right");
      }

      // Wait for slide-out to complete, then update content and slide in
      setTimeout(() => {
        this.currentPage = pageIndex;

        // Stop unscramble audio
        this.audioManager.stopUnscrambleAudio();

        console.log(
          `🔍 Starting page ${pageIndex + 1}, content:`,
          pages[pageIndex] ? pages[pageIndex].substring(0, 100) : "UNDEFINED"
        );

        // Update content
        this.continuePageSetup(pageIndex, pageEl, el, promptElem);

        // Trigger slide-in animation based on direction
        pageEl.classList.remove("slide-out-left", "slide-out-right");
        if (goingForward) {
          pageEl.classList.add("slide-in-right");
        } else {
          pageEl.classList.add("slide-in-left");
        }

        // Remove animation class after completion
        setTimeout(() => {
          pageEl.classList.remove("slide-in-right", "slide-in-left");
        }, animationConfig.slideTransitionDurationMs);
      }, animationConfig.slideTransitionDurationMs);

      return; // Exit early, will continue after animation
    }

    // First load - no animation
    this.currentPage = pageIndex;

    console.log(
      `🔍 Starting page ${pageIndex + 1}, content:`,
      pages[pageIndex] ? pages[pageIndex].substring(0, 100) : "UNDEFINED"
    );

    this.continuePageSetup(pageIndex, pageEl, el, promptElem);
  }

  /**
   * Continue page setup after animations
   */
  continuePageSetup(pageIndex, pageEl, el, promptElem) {
    // Clear all timeouts and intervals
    this.animationManager.clearAllTimeouts();

    // Audio control: only allow audio on video slide (3)
    const allowedAudioSlides = [2]; // Slide 3 (video) - using 0-based index
    if (!allowedAudioSlides.includes(pageIndex)) {
      // Stop all audio when not on allowed slides
      this.audioManager.stopCurrentAudio();

      // Also stop any other audio elements
      document.querySelectorAll("audio").forEach((audio) => {
        if (audio.id !== "video-audio" && !audio.paused) {
          console.log("🛑 Stopping additional audio element:", audio.id);
          audio.pause();
          audio.currentTime = 0;
        }
      });
    }

    // Stop any typing animations
    this.animationManager.resetTypingState();

    // Clean up unused DOM elements
    this.cleanupUnusedElements();

    // Reset animation state
    this.animationManager.isAnimating = false;
    this.animationManager.isInLineRevealMode = false;

    // Set data-page attribute for CSS targeting
    pageEl.setAttribute("data-page", pageIndex + 1);

    // Set consistent text size
    const mobile = isMobile();
    el.style.fontSize = mobile ? "0.8rem" : "1.2rem";
    el.style.paddingBottom = "";

    // Show text for all pages
    if (pageIndex < pages.length) {
      const textWrap = document.getElementById("text-wrap");
      if (textWrap) {
        textWrap.style.display = "block";
      }

      el.textContent = "";

      // Handle different page display modes
      if (pageIndex === 0) {
        // Instant display for page 0
        el.textContent = mobile
          ? this.animationManager.wrapTextForMobile(pages[pageIndex])
          : pages[pageIndex];
        this.animationManager.wrapYearsInSpans(el);
      } else if (pageIndex === 2) {
        // Slide 3 (video slide) - no scrambling
        console.log(
          `🎬 Video slide ${
            pageIndex + 1
          }: Skipping scramble, showing play button`
        );
        el.textContent = "";
      } else if (pageIndex === 1) {
        // Slide 2 - wait for slide animation before unscrambling
        console.log(
          `🎯 SLIDE 2: Waiting for slide animation to complete before unscrambling`
        );
        el.textContent = "";
        setTimeout(() => {
          console.log(
            `🎯 SCRAMBLE: Starting delayed unscrambling for slide ${
              pageIndex + 1
            }`
          );
          this.animationManager.scrambleFastChunks(
            el,
            pages[pageIndex],
            this.currentPage,
            () => {
              console.log(`✅ Slide 2 unscrambling completed`);
            }
          );
        }, 750);
      } else {
        console.log(
          `🎯 SCRAMBLE: Displaying content for slide ${pageIndex + 1}`
        );
        this.animationManager.scrambleFastChunks(
          el,
          pages[pageIndex],
          this.currentPage,
          () => {
            // Text displayed
          }
        );
      }
    }

    // Handle specific images for different slides
    console.log(
      `🖼️ DEBUG: Checking images for pageIndex ${pageIndex} (slide ${
        pageIndex + 1
      })`
    );
    if (pageIndex === 3) {
      // Slide 4 - Correa photo
      console.log(`🖼️ DEBUG: Adding Correa photo for slide 4`);
      this.imageManager.addCorreaPhoto();
    } else if (pageIndex === 4) {
      // Slide 5 - Arrest photo
      console.log(`🖼️ DEBUG: Adding Arrest photo for slide 5`);
      this.imageManager.addArrestPhoto();
    } else {
      console.log(`🖼️ DEBUG: Removing all images for slide ${pageIndex + 1}`);
      this.imageManager.removeAllImages();
    }

    // Show video on slide 3
    console.log(
      `🔍 Debug: Current page ${
        pageIndex + 1
      }, checking for video on slide 3...`
    );
    if (pageIndex + 1 === 3) {
      console.log("🎬 SLIDE 3 - Showing video...");
      document.body.classList.add("video-slide-active");
      this.videoManager.showVideo3Background();
    } else {
      console.log(
        `🎬 Not slide 3 (current: ${pageIndex + 1}), hiding video...`
      );
      document.body.classList.remove("video-slide-active");
      this.videoManager.hideVideo3Background();
      this.videoManager.resetVideoStartTime();
    }

    // Update nav message and slide counter
    this.updateNavigationUI(pageIndex);
  }

  /**
   * Update navigation UI elements
   */
  updateNavigationUI(pageIndex) {
    const navMsg = document.getElementById("nav-msg");
    const slideCounter = document.getElementById("slide-counter");

    if (pageIndex <= 1) {
      // Slides 1-2: Show PRESS SPACEBAR in nav-msg, hide slide counter
      if (navMsg) {
        navMsg.innerHTML = "PRESS SPACEBAR<br>TO CONTINUE";
        navMsg.style.fontSize = "0.7rem";
        navMsg.style.textAlign = "center";
        navMsg.style.visibility = "visible";
        navMsg.style.minWidth = "120px";
        navMsg.style.maxWidth = "140px";
        navMsg.style.lineHeight = "1.3";
        navMsg.style.whiteSpace = "normal";
      }
      if (slideCounter) {
        slideCounter.style.visibility = "hidden";
      }
    } else {
      // Slide 3 onwards: Show slide counter in nav-msg area
      if (navMsg) {
        navMsg.textContent = `SLIDE ${pageIndex + 1} / ${pages.length}`;
        navMsg.style.fontSize = "0.7rem";
        navMsg.style.textAlign = "center";
        navMsg.style.visibility = "visible";
        navMsg.style.minWidth = "100px";
        navMsg.style.maxWidth = "140px";
        navMsg.style.whiteSpace = "nowrap";
      }
      if (slideCounter) {
        slideCounter.style.visibility = "hidden";
      }
    }
    console.log(`📊 Navigation updated for page ${pageIndex + 1}`);
  }

  /**
   * Clean up unused DOM elements
   */
  cleanupUnusedElements() {
    // Clean up images that are not for current or next page
    const currentPageNumber = this.currentPage + 1;
    const nextPageNumber = this.currentPage + 2;

    document.querySelectorAll("#page img").forEach((img) => {
      const imgId = img.id;
      if (imgId) {
        const pageNumber = parseInt(imgId.replace("img-", ""));
        if (pageNumber < currentPageNumber - 1 || pageNumber > nextPageNumber) {
          console.log(`🧹 Cleaning up unused image for page ${pageNumber}`);
          img.remove();
        }
      }
    });

    // Clean up old persistent text elements
    const oldPersistentText = document.getElementById("persistent-text");
    if (oldPersistentText && this.currentPage !== 4) {
      oldPersistentText.remove();
    }
  }

  /**
   * Setup event listeners for navigation
   */
  setupEventListeners() {
    // Navigation buttons
    document
      .getElementById("nav-prev")
      .addEventListener("click", () => this.goBack());
    document
      .getElementById("nav-next")
      .addEventListener("click", () => this.safeAdvance());

    // Click navigation
    document.addEventListener("click", (e) => {
      if (e.target.id === "nav-prev" || e.target.id === "nav-next") return;

      // Ignore clicks on play button and its children
      if (
        e.target.id === "video-play-button" ||
        e.target.id === "video-play-triangle" ||
        e.target.id === "video-play-text" ||
        e.target.closest("#video-play-button")
      ) {
        return;
      }

      // Don't navigate if already navigating
      if (this.isNavigating) return;

      // If in line reveal mode, clicking advances to next line
      if (this.animationManager.isInLineReveal()) {
        e.preventDefault();
        this.animationManager.showNextLineManual();
        return;
      }

      // Normal mode: Left half goes back, right half goes forward
      if (e.clientX < window.innerWidth / 2) {
        this.goBack();
      } else {
        this.safeAdvance();
      }
    });

    // Keyboard navigation
    window.addEventListener("keydown", (e) => {
      e.preventDefault();

      // Check if we're in line reveal mode
      if (
        this.animationManager.isInLineReveal() &&
        (e.code === "Space" || e.code === "ArrowRight")
      ) {
        this.animationManager.showNextLineManual();
        return;
      }

      if (e.code === "Space" || e.code === "ArrowRight") {
        this.audioManager.unlockAudioContext();
        this.startPage(this.currentPage + 1);
      } else if (e.code === "ArrowLeft") {
        this.audioManager.unlockAudioContext();
        this.startPage(this.currentPage - 1);
      }
    });
  }

  /**
   * Get current page index
   */
  getCurrentPage() {
    return this.currentPage;
  }

  /**
   * Check if currently navigating
   */
  isCurrentlyNavigating() {
    return this.isNavigating;
  }
}
