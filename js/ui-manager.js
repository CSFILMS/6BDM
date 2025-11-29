/**
 * UI Manager
 * Handles UI elements like custom cursor, fullscreen, color overlays, and fonts
 *
 * NOTE: Color system could be refactored to use CSS custom properties (CSS variables)
 * instead of direct style manipulation for better maintainability and theming support.
 */

import { colors, fonts } from "./constants.js";

export class UIManager {
  constructor() {
    this.currentOverlayMode = "full"; // Default to full green
    this.currentFontIndex = 0; // Start with Crisp
    this.currentColorIndex = 1; // Default to bright green
    this.customCursor = null;
  }

  /**
   * Setup custom cursor
   */
  setupCursor() {
    this.customCursor = document.getElementById("custom-cursor");

    document.addEventListener("mousemove", (e) => {
      if (this.customCursor) {
        this.customCursor.style.display = "block";
        this.customCursor.style.left = e.clientX - 10 + "px";
        this.customCursor.style.top = e.clientY - 10 + "px";
      }
    });

    document.addEventListener("mouseleave", () => {
      if (this.customCursor) {
        this.customCursor.style.display = "none";
      }
    });
  }

  /**
   * Toggle fullscreen mode
   */
  toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.log(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }

  /**
   * Toggle green overlay on images
   */
  toggleGreenOverlay(mode) {
    this.currentOverlayMode = mode;
    const images = document.querySelectorAll("#page img");
    images.forEach((img) => {
      this.applyOverlayToImage(img, mode);
    });
  }

  /**
   * Apply overlay to a specific image
   */
  applyOverlayToImage(img, mode) {
    // Check if this is photo23 (which should stay dimmed) or page 10 images (darker)
    const isDimmedPhoto = img.id === "img-23";
    const isDarkerPhoto = img.id.startsWith("img-10");
    const baseBrightness = isDarkerPhoto ? 0.5 : isDimmedPhoto ? 0.5 : 0.8;

    if (mode === "full") {
      img.style.filter = `grayscale(1) brightness(${baseBrightness}) contrast(1.2) sepia(1) hue-rotate(60deg) saturate(4)`;
    } else if (mode === "half") {
      img.style.filter = `brightness(${baseBrightness}) grayscale(1)`;
    } else if (mode === "off") {
      img.style.filter = `brightness(${baseBrightness})`;
    }
  }

  /**
   * Apply current font to all text elements
   */
  applyCurrentFont() {
    const selectedFont = fonts[this.currentFontIndex];
    console.log("Applying font:", selectedFont);

    // Update the CSS custom property
    document.documentElement.style.setProperty(
      "--font-family",
      selectedFont.family
    );

    // Apply font family to all text elements
    const allTextElements = document.querySelectorAll(
      "#unscramble, #prompt, #nav-msg, #nav-prev, #nav-next, #slide-counter"
    );
    allTextElements.forEach((el) => {
      if (el) {
        el.style.fontFamily = selectedFont.family;
      }
    });

    // Also apply to body to ensure all elements inherit the font
    document.body.style.fontFamily = selectedFont.family;

    console.log(`Font changed to: ${selectedFont.family}`);
  }

  /**
   * Cycle font forward (only one font available)
   */
  cycleFontForward() {
    this.applyCurrentFont();
  }

  /**
   * Cycle font backward (only one font available)
   */
  cycleFontBackward() {
    this.applyCurrentFont();
  }

  /**
   * Apply color scheme to UI elements
   */
  applyColorScheme() {
    const terminals = [
      document.getElementById("unscramble"),
      document.getElementById("prompt"),
      document.getElementById("nav-msg"),
      document.getElementById("nav-prev"),
      document.getElementById("nav-next"),
      document.getElementById("slide-counter"),
    ];

    const currentColor = colors.schemes[this.currentColorIndex];

    terminals.forEach((el) => {
      if (!el) return;
      el.style.color = currentColor;
      el.style.textShadow = `0 0 2px ${currentColor}, 0 0 8px ${currentColor}, 0 0 16px ${currentColor}`;
      el.style.filter = "saturate(1.3)";
      el.style.webkitFilter = "saturate(1.3)";
    });

    // Update cursor color to match
    const customCursor = document.getElementById("custom-cursor");
    if (customCursor) {
      customCursor.style.background = currentColor;
      customCursor.style.boxShadow = `0 0 2px ${currentColor}, 0 0 8px ${currentColor}, 0 0 16px ${currentColor}`;
    }
  }

  /**
   * Set color scheme by index
   */
  setColorScheme(index) {
    if (index >= 0 && index < colors.schemes.length) {
      this.currentColorIndex = index;
      this.applyColorScheme();
    }
  }

  /**
   * Setup keyboard shortcuts for UI
   */
  setupKeyboardShortcuts() {
    window.addEventListener("keydown", (e) => {
      const k = e.key;

      // Color shortcuts
      if (k === "1" || k === "2" || k === "3") {
        const colorIndex = parseInt(k, 10) - 1;
        this.setColorScheme(colorIndex);
      }
      // Overlay shortcuts
      else if (k === "z" || k === "Z") {
        this.toggleGreenOverlay("full");
      } else if (k === "x" || k === "X") {
        this.toggleGreenOverlay("half");
      } else if (k === "c" || k === "C") {
        this.toggleGreenOverlay("off");
      }
      // Fullscreen shortcut
      else if (k === "f" || k === "F") {
        this.toggleFullscreen();
      }
    });
  }

  /**
   * Setup image error handling
   */
  setupImageErrorHandling() {
    // Hide any images that fail to load
    document.querySelectorAll("#page img").forEach((img) => {
      img.addEventListener("error", () => {
        img.style.display = "none";
      });
    });
  }

  /**
   * Clean up unused DOM elements
   */
  cleanupElements() {
    // This method can be expanded to handle more cleanup tasks
    const elementsToClean = [
      "persistent-text",
      "video-end-subtitle",
      "bdm-subtitle",
    ];

    elementsToClean.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.remove();
      }
    });
  }

  /**
   * Initialize all UI components
   */
  initialize() {
    this.setupCursor();
    this.applyCurrentFont();
    this.applyColorScheme();
    this.setupKeyboardShortcuts();
    this.setupImageErrorHandling();

    console.log("✅ UI Manager initialized");
  }
}
