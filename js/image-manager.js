/**
 * Image Manager
 * Handles slide-specific image display and removal
 *
 * NOTE: Consider implementing lazy loading for images to improve initial page load.
 * Images could be preloaded only when approaching their respective slides.
 */

import { imageSources, isMobile } from "./constants.js";

export class ImageManager {
  constructor() {
    this.activeImages = new Set();
  }

  /**
   * Add Cannes photo (slide 5)
   */
  addCannesPhoto() {
    this.removeAllImages();

    const mobile = isMobile();

    // Create container for Cannes photo
    const imageContainer = document.createElement("div");
    imageContainer.id = "cannes-photo-container";
    imageContainer.style.cssText = `
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
      overflow: visible !important;
      transition: opacity 0.15s ease-in-out !important;
    `;
    document.body.appendChild(imageContainer);
    this.activeImages.add(imageContainer);

    // Add Cannes photo
    const img = document.createElement("img");
    img.id = "cannes-photo";
    img.src = imageSources.cannes;
    img.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain !important;
      filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
      display: block !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease-in-out !important;
    `;
    imageContainer.appendChild(img);

    // Quick fade-in effect with brightness flash
    imageContainer.style.opacity = "0";
    setTimeout(() => {
      imageContainer.style.opacity = "1";
      img.style.opacity = "1";
      img.style.filter =
        "brightness(1.2) sepia(1) hue-rotate(60deg) saturate(4.0)";
      img.style.boxShadow =
        "inset 0 0 50px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.4)";
      setTimeout(() => {
        img.style.filter =
          "brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0)";
        img.style.boxShadow = "none";
      }, 200);
    }, 50);

    console.log("Cannes photo added to slide 5");
  }

  /**
   * Add Arrest photo (slide 5)
   */
  addArrestPhoto() {
    this.removeAllImages();

    const mobile = isMobile();

    // Create container for Arrest photo
    const imageContainer = document.createElement("div");
    imageContainer.id = "arrest-photo-container";
    imageContainer.style.cssText = `
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
      overflow: visible !important;
      transition: opacity 0.15s ease-in-out !important;
    `;
    document.body.appendChild(imageContainer);
    this.activeImages.add(imageContainer);

    // Add Arrest photo
    const img = document.createElement("img");
    img.id = "arrest-photo";
    img.src = imageSources.arrest;
    img.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain !important;
      filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
      display: block !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease-in-out !important;
    `;
    imageContainer.appendChild(img);

    // Quick fade-in effect
    imageContainer.style.opacity = "0";
    setTimeout(() => {
      imageContainer.style.opacity = "1";
      img.style.opacity = "0.4";
    }, 50);

    console.log("Arrest photo added to slide 5");
  }

  /**
   * Add Collateral photo
   */
  addCollateralPhoto() {
    this.removeAllImages();

    const mobile = isMobile();

    // Create container for Collateral photo
    const imageContainer = document.createElement("div");
    imageContainer.id = "collateral-photo-container";
    imageContainer.style.cssText = `
      position: fixed !important;
      bottom: ${mobile ? "22vh" : "18vh"} !important;
      left: 50% !important;
      transform: translateX(-50%) !important;
      max-width: ${mobile ? "75vw" : "50vw"} !important;
      max-height: ${mobile ? "35vh" : "25vh"} !important;
      width: ${mobile ? "75vw" : "50vw"} !important;
      height: auto !important;
      z-index: 1 !important;
      pointer-events: none !important;
      overflow: visible !important;
      transition: opacity 0.15s ease-in-out !important;
    `;

    // Add desktop-only styling with higher specificity
    const style = document.createElement("style");
    style.textContent = `
      @media (min-width: 769px) {
        #collateral-photo-container {
          z-index: 0 !important;
        }
        #collateral-photo {
          display: block !important;
          opacity: 0.35 !important;
          filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
        }
      }
      @media (max-width: 768px) {
        #collateral-photo-container {
          z-index: 1 !important;
        }
        #collateral-photo {
          display: block !important;
          opacity: 0.35 !important;
          filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
        }
      }
      #collateral-photo-container #collateral-photo {
        display: block !important;
        position: relative !important;
      }
    `;
    document.head.appendChild(style);
    document.getElementById("page").appendChild(imageContainer);
    this.activeImages.add(imageContainer);

    // Add Collateral photo
    const img = document.createElement("img");
    img.id = "collateral-photo";
    img.src = imageSources.collateral;
    img.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain !important;
      filter: brightness(0.5) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
      display: block !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease-in-out !important;
    `;
    imageContainer.appendChild(img);

    // Quick fade-in effect with brightness flash
    imageContainer.style.opacity = "0";
    setTimeout(() => {
      imageContainer.style.opacity = "1";
      img.style.opacity = "1";
      img.style.filter =
        "brightness(0.7) sepia(1) hue-rotate(60deg) saturate(4.0)";
      img.style.boxShadow =
        "inset 0 0 50px rgba(0, 255, 0, 0.6), 0 0 30px rgba(0, 255, 0, 0.4)";
      setTimeout(() => {
        img.style.filter =
          "brightness(0.5) sepia(1) hue-rotate(60deg) saturate(4.0)";
        img.style.boxShadow = "none";
      }, 200);
    }, 50);

    console.log(
      "Collateral photo added - should be behind text and dimmed on desktop"
    );
  }

  /**
   * Add Correa photo (slide 4)
   */
  addCorreaPhoto() {
    this.removeAllImages();

    const mobile = isMobile();

    // Create container for Correa photo
    const imageContainer = document.createElement("div");
    imageContainer.id = "correa-photo-container";
    imageContainer.style.cssText = `
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
      overflow: visible !important;
      transition: opacity 0.15s ease-in-out !important;
    `;
    document.body.appendChild(imageContainer);
    this.activeImages.add(imageContainer);

    // Add Correa photo
    const img = document.createElement("img");
    img.id = "correa-photo";
    img.src = imageSources.correa;
    img.style.cssText = `
      width: 100% !important;
      height: 100% !important;
      max-width: none !important;
      max-height: none !important;
      object-fit: contain !important;
      filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0) !important;
      display: block !important;
      opacity: 0 !important;
      transition: opacity 0.4s ease-in-out !important;
    `;
    imageContainer.appendChild(img);

    // Quick fade-in effect
    imageContainer.style.opacity = "0";
    setTimeout(() => {
      imageContainer.style.opacity = "1";
      img.style.opacity = "0.6";
    }, 50);

    console.log("Correa photo added to slide 4");
  }

  /**
   * Remove all active images
   */
  removeAllImages() {
    // Quick fade out all image containers
    const containers = [
      document.getElementById("cannes-photo-container"),
      document.getElementById("arrest-photo-container"),
      document.getElementById("correa-photo-container"),
      document.getElementById("collateral-photo-container"),
    ];

    containers.forEach((container) => {
      if (container) {
        container.style.opacity = "0";
        setTimeout(() => container.remove(), 150);
        this.activeImages.delete(container);
      }
    });

    // Remove 6BDM subtitle element
    const bdmSubtitle = document.getElementById("bdm-subtitle");
    if (bdmSubtitle) {
      bdmSubtitle.remove();
    }

    // Remove any other images
    document.querySelectorAll("#page img").forEach((img) => {
      img.remove();
    });
  }

  /**
   * Clean up all resources
   */
  cleanup() {
    this.removeAllImages();
    this.activeImages.clear();
  }
}
