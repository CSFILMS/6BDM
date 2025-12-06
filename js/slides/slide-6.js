/**
 * Slide 6 - Arrest Photo with Text
 * Imagen de arresto con fade in y texto con typewriter
 */

import { pages, imageSources, isMobile } from "../constants.js";

export class Slide6 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.imageContainer = null;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
        height: 100%;
      ">
        <div id="slide-6-text" style="
          font-family: var(--font-family);
          color: var(--fg);
          font-size: 1.1rem;
          line-height: 1.5;
          white-space: pre-wrap;
          text-align: left;
          max-width: 90%;
          flex: 1;
          display: flex;
          align-items: center;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 6 (Arrest Photo)");

    // Show image with fade-in
    this.showArrestPhoto();

    // Show text with scramble animation
    const textElement = document.getElementById("slide-6-text");
    if (textElement && pages[5]) {
      // Play typing audio
      this.audioHelper.playTypingAudio();

      // Start scramble animation
      this.animationHelper.scrambleText(textElement, pages[5], () => {
        this.audioHelper.stopTypingAudio();
        console.log("✅ Slide 6 text complete");
      });
    }
  }

  showArrestPhoto() {
    const mobile = isMobile();

    // Create container for photo
    this.imageContainer = document.createElement("div");
    this.imageContainer.id = "slide-6-arrest-container";
    this.imageContainer.style.cssText = `
      position: fixed !important;
      bottom: ${mobile ? "25vh" : "20vh"} !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      max-width: ${mobile ? "60vw" : "40vw"} !important;
      max-height: ${mobile ? "28vh" : "20vh"} !important;
      width: ${mobile ? "60vw" : "40vw"} !important;
      height: auto !important;
      z-index: 1 !important;
      pointer-events: none !important;
      transition: opacity 0.4s ease-in-out !important;
    `;
    document.body.appendChild(this.imageContainer);

    // Add photo
    const img = document.createElement("img");
    img.src = imageSources.arrest;
    img.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      object-fit: contain !important;
      filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
      display: block !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease-in-out !important;
    `;
    this.imageContainer.appendChild(img);

    // Fade in
    this.imageContainer.style.opacity = "0";
    setTimeout(() => {
      this.imageContainer.style.opacity = "1";
      img.style.opacity = "0.4";
    }, 50);

    console.log("🖼️ Arrest photo added");
  }

  onExit() {
    console.log("🚪 Exiting Slide 6");

    // Remove image
    if (this.imageContainer) {
      this.imageContainer.style.opacity = "0";
      setTimeout(() => {
        if (this.imageContainer && this.imageContainer.parentNode) {
          this.imageContainer.remove();
        }
      }, 150);
    }

    // Stop audio and animations
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }

  cleanup() {
    if (this.imageContainer && this.imageContainer.parentNode) {
      this.imageContainer.remove();
    }
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }
}
