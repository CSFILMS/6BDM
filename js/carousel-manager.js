/**
 * Carousel Manager
 * Handles horizontal carousel navigation with drag/swipe support
 */

export class CarouselManager {
  constructor(containerSelector, slides) {
    this.container = document.querySelector(containerSelector);
    this.slides = slides;
    this.currentIndex = 0;
    this.isTransitioning = false;
    this.isDragging = false;
    this.startX = 0;
    this.currentX = 0;
    this.dragOffset = 0;
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
    this.updateTransform(false);

    // Call onEnter for first slide
    setTimeout(() => {
      const firstSlide = this.slides[0];
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

    // Create slides wrapper
    this.slidesWrapper = document.createElement("div");
    this.slidesWrapper.id = "slides-wrapper";
    this.slidesWrapper.style.cssText = `
      display: flex;
      width: 100%;
      height: 100%;
      transition: transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1);
      will-change: transform;
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
   * Setup event listeners for navigation and drag
   */
  setupEventListeners() {
    // Keyboard navigation
    window.addEventListener("keydown", (e) => this.handleKeydown(e));

    // Mouse drag
    this.slidesWrapper.addEventListener("mousedown", (e) =>
      this.handleDragStart(e)
    );
    window.addEventListener("mousemove", (e) => this.handleDragMove(e));
    window.addEventListener("mouseup", (e) => this.handleDragEnd(e));

    // Touch drag
    this.slidesWrapper.addEventListener(
      "touchstart",
      (e) => this.handleDragStart(e),
      { passive: true }
    );
    window.addEventListener("touchmove", (e) => this.handleDragMove(e), {
      passive: true,
    });
    window.addEventListener("touchend", (e) => this.handleDragEnd(e));

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
      this.updateTransform(false);
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
    }
  }

  /**
   * Handle drag/swipe start
   */
  handleDragStart(e) {
    if (this.isTransitioning) return;

    this.isDragging = true;
    this.startX = e.type === "touchstart" ? e.touches[0].clientX : e.clientX;
    this.currentX = this.startX;
    this.slidesWrapper.style.transition = "none";
  }

  /**
   * Handle drag/swipe move
   */
  handleDragMove(e) {
    if (!this.isDragging) return;

    this.currentX = e.type === "touchmove" ? e.touches[0].clientX : e.clientX;
    this.dragOffset = this.currentX - this.startX;

    // Update transform with drag offset
    const translateX = -(this.currentIndex * this.slideWidth) + this.dragOffset;
    this.slidesWrapper.style.transform = `translate3d(${translateX}px, 0, 0)`;
  }

  /**
   * Handle drag/swipe end
   */
  handleDragEnd(e) {
    if (!this.isDragging) return;

    this.isDragging = false;
    this.slidesWrapper.style.transition =
      "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";

    // Determine if we should snap to next/prev slide
    const dragThreshold = this.slideWidth * 0.2; // 20% of screen width

    if (
      this.dragOffset < -dragThreshold &&
      this.currentIndex < this.slides.length - 1
    ) {
      // Swiped left - go to next slide
      this.next();
    } else if (this.dragOffset > dragThreshold && this.currentIndex > 0) {
      // Swiped right - go to previous slide
      this.prev();
    } else {
      // Snap back to current slide
      this.updateTransform(true);
    }

    this.dragOffset = 0;
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
   * Go to specific slide
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

    // Update index and transform
    this.currentIndex = index;
    this.updateTransform(true);

    // Update navigation UI
    this.updateNavigationUI();

    // Call onEnter on new slide
    setTimeout(() => {
      const newSlide = this.slides[this.currentIndex];
      if (newSlide.onEnter) {
        newSlide.onEnter();
      }

      this.isTransitioning = false;
      console.log(`📍 Navigated to slide ${this.currentIndex + 1}`);
    }, 300); // Match transition duration
  }

  /**
   * Update transform position
   */
  updateTransform(animated = true) {
    if (animated) {
      this.slidesWrapper.style.transition =
        "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
    } else {
      this.slidesWrapper.style.transition = "none";
    }

    const translateX = -(this.currentIndex * this.slideWidth);
    this.slidesWrapper.style.transform = `translate3d(${translateX}px, 0, 0)`;

    // Reset transition after update
    if (!animated) {
      setTimeout(() => {
        this.slidesWrapper.style.transition =
          "transform 0.3s cubic-bezier(0.4, 0.0, 0.2, 1)";
      }, 50);
    }
  }

  /**
   * Update navigation UI (nav message and slide counter)
   */
  updateNavigationUI() {
    const navMsg = document.getElementById("nav-msg");
    const slideCounter = document.getElementById("slide-counter");

    if (this.currentIndex <= 1) {
      // Slides 1-2: Show PRESS SPACEBAR
      if (navMsg) {
        navMsg.innerHTML = "PRESS SPACEBAR<br>TO CONTINUE";
        navMsg.style.fontSize = "0.7rem";
        navMsg.style.visibility = "visible";
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
