/**
 * Carousel Manager
 * Terminal-style navigation: instant transitions, no swipe/drag
 */

export class CarouselManager {
  constructor(containerSelector, slides) {
    this.container = document.querySelector(containerSelector);
    this.slides = slides;
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.slideWidth = window.innerWidth;
    this.slidesWrapper = null;
    this.lastNavigationTime = 0;
    this.navigationThrottle = 600; // ms
  }

  /**
   * Initialize carousel
   */
  init() {
    console.log("🔍 DEBUG: Initializing carousel...");
    console.log("🔍 DEBUG: Container:", this.container);
    console.log("🔍 DEBUG: Slides count:", this.slides.length);

    this.createCarouselStructure();
    this.renderSlides();
    this.setupEventListeners();

    // Update nav UI before going to first slide
    this.updateNavigationUI();

    // Go to first slide
    this.currentIndex = 0;
    this.updateTransform();

    // Call onEnter for first slide
    setTimeout(() => {
      const firstSlide = this.slides[this.currentIndex];
      if (firstSlide && firstSlide.onEnter) {
        firstSlide.onEnter();
      }
    }, 100);

    console.log("🎠 Carousel initialized with", this.slides.length, "slides");
  }

  /**
   * Create carousel HTML structure
   */
  createCarouselStructure() {
    this.container.innerHTML = "";

    // Create slides wrapper - Terminal style: no transitions, instant changes
    this.slidesWrapper = document.createElement("div");
    this.slidesWrapper.id = "slides-wrapper";
    this.slidesWrapper.style.cssText = `
      display: flex;
      width: 100%;
      height: 100%;
      transition: none;
    `;

    this.container.appendChild(this.slidesWrapper);
  }

  /**
   * Render all slides
   */
  renderSlides() {
    console.log("🔍 DEBUG: Rendering", this.slides.length, "slides...");

    this.slides.forEach((slide, index) => {
      console.log(`🔍 DEBUG: Rendering slide ${index + 1}...`);

      const slideElement = document.createElement("div");
      slideElement.className = "slide";
      slideElement.dataset.slideIndex = index;
      slideElement.style.cssText = `
        flex: 0 0 100vw;
        width: 100vw;
        height: 100%;
        position: relative;
        overflow: hidden;
      `;

      // Render slide content
      const slideContent = slide.render();
      console.log(
        `🔍 DEBUG: Slide ${index + 1} content length:`,
        slideContent.length
      );

      slideElement.innerHTML = slideContent;
      this.slidesWrapper.appendChild(slideElement);
    });

    console.log(
      "🔍 DEBUG: Slides wrapper children count:",
      this.slidesWrapper.children.length
    );
  }

  /**
   * Setup event listeners for navigation (Terminal style: no drag/swipe)
   */
  setupEventListeners() {
    // Keyboard navigation only
    window.addEventListener("keydown", (e) => this.handleKeydown(e));

    // Navigation buttons
    const navPrev = document.getElementById("nav-prev");
    const navNext = document.getElementById("nav-next");

    if (navPrev) {
      navPrev.addEventListener("click", () => this.prev());
    }

    if (navNext) {
      navNext.addEventListener("click", () => this.next());
    }

    // Click navigation (left/right halves of screen)
    this.container.addEventListener("click", (e) => {
      // Ignore if clicking on navigation or special elements
      if (e.target.id === "nav-prev" || e.target.id === "nav-next") return;
      if (e.target.closest("#video-play-button")) return;
      if (e.target.closest("#nav")) return;

      // Left half goes back, right half goes forward
      if (e.clientX < window.innerWidth / 2) {
        this.prev();
      } else {
        this.next();
      }
    });

    // Window resize
    window.addEventListener("resize", () => {
      this.slideWidth = window.innerWidth;
      this.updateTransform();
    });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(e) {
    if (e.code === "Space" || e.code === "ArrowRight") {
      e.preventDefault();
      this.next();
    } else if (e.code === "ArrowLeft") {
      e.preventDefault();
      this.prev();
    } else if (e.code === "KeyF") {
      e.preventDefault();
      this.toggleFullscreen();
    }
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.webkitRequestFullscreen) {
        elem.webkitRequestFullscreen(); // Safari
      } else if (elem.msRequestFullscreen) {
        elem.msRequestFullscreen(); // IE11
      }
      console.log("🖥️ Entering fullscreen mode");
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen(); // Safari
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen(); // IE11
      }
      console.log("🖥️ Exiting fullscreen mode");
    }
  }

  /**
   * Go to next slide
   */
  next() {
    if (this.isTransitioning) return;

    // Throttle navigation
    const now = Date.now();
    if (now - this.lastNavigationTime < this.navigationThrottle) return;
    this.lastNavigationTime = now;

    // Check if current slide allows navigation
    const currentSlide = this.slides[this.currentIndex];
    if (currentSlide.canNavigateNext && !currentSlide.canNavigateNext()) {
      console.log("🚫 Current slide blocks navigation");
      return;
    }

    if (this.currentIndex < this.slides.length - 1) {
      this.goToSlide(this.currentIndex + 1);
    }
  }

  /**
   * Go to previous slide
   */
  prev() {
    if (this.isTransitioning) return;

    // Throttle navigation
    const now = Date.now();
    if (now - this.lastNavigationTime < this.navigationThrottle) return;
    this.lastNavigationTime = now;

    if (this.currentIndex > 0) {
      this.goToSlide(this.currentIndex - 1);
    }
  }

  /**
   * Go to specific slide (Terminal style: instant switch, no animation)
   */
  goToSlide(index) {
    if (index < 0 || index >= this.slides.length || index === this.currentIndex)
      return;
    if (this.isTransitioning) return;

    this.isTransitioning = true;

    // Call onExit on current slide
    const currentSlide = this.slides[this.currentIndex];
    if (currentSlide.onExit) {
      currentSlide.onExit();
    }

    // Update index and transform - instant switch
    this.currentIndex = index;
    this.updateTransform();

    // Update navigation UI
    this.updateNavigationUI();

    // Call onEnter on new slide immediately (no animation delay)
    const newSlide = this.slides[this.currentIndex];
    if (newSlide.onEnter) {
      newSlide.onEnter();
    }

    this.isTransitioning = false;
    console.log(`📍 Navigated to slide ${this.currentIndex + 1}`);
  }

  /**
   * Update transform position (Terminal style: instant, no animation)
   */
  updateTransform() {
    const translateX = -(this.currentIndex * this.slideWidth);
    this.slidesWrapper.style.transform = `translate3d(${translateX}px, 0, 0)`;
  }

  /**
   * Update navigation UI (nav message and slide counter)
   */
  updateNavigationUI() {
    const navMsg = document.getElementById("nav-msg");
    const slideCounter = document.getElementById("slide-counter");

    if (this.currentIndex < 1) {
      // Slides 0-1: Show PRESS SPACEBAR
      if (navMsg) {
        navMsg.innerHTML = "PRESS SPACEBAR TO CONTINUE";
        navMsg.style.fontSize = "0.7rem";
        navMsg.style.visibility = "visible";
        navMsg.style.width = "66px";
      }
      if (slideCounter) {
        slideCounter.style.visibility = "hidden";
      }
    } else {
      // Slide 3 onwards: Show slide counter
      if (navMsg) {
        navMsg.textContent = `SLIDE ${this.currentIndex + 1} / ${
          this.slides.length
        }`;
        navMsg.style.fontSize = "0.7rem";
        navMsg.style.visibility = "visible";
      }
      if (slideCounter) {
        slideCounter.style.visibility = "hidden";
      }
    }
  }

  /**
   * Get current slide index
   */
  getCurrentIndex() {
    return this.currentIndex;
  }

  /**
   * Get current slide
   */
  getCurrentSlide() {
    return this.slides[this.currentIndex];
  }
}
