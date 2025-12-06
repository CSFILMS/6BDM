/**
 * Slide 5 - Correa Photo with Text
 * Imagen de Rafael Correa con fade in y texto con typewriter
 * Texto arriba y abajo de la imagen
 */

import { pages, imageSources, isMobile } from "../constants.js";

export class Slide5 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 5% 10%;
        gap: 2rem;
        overflow: hidden;
      ">
        <!-- Texto superior -->
        <div id="slide-5-text-top" style="
          font-family: var(--font-family);
          color: var(--fg);
          font-size: 1.1rem;
          line-height: 1.5;
          white-space: pre-wrap;
          text-align: left;
          width: 90%;
          max-width: 90%;
          height: ${isMobile() ? "18vh" : "15vh"};
          min-height: ${isMobile() ? "18vh" : "15vh"};
          max-height: ${isMobile() ? "18vh" : "15vh"};
          flex: 0 0 ${isMobile() ? "18vh" : "15vh"};
          overflow-wrap: break-word;
          word-wrap: break-word;
          overflow: hidden;
          box-sizing: border-box;
        "></div>
        
        <!-- Imagen -->
        <div id="slide-5-image-container" style="
          max-width: ${isMobile() ? "60vw" : "40vw"};
          max-height: ${isMobile() ? "28vh" : "20vh"};
          width: ${isMobile() ? "60vw" : "40vw"};
          height: auto;
          flex: 0 0 auto;
          opacity: 0;
          transition: opacity 0.4s ease-in-out;
        ">
          <img id="slide-5-image" src="${imageSources.correa}" style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0);
            display: block;
            opacity: 0.6;
            transition: opacity 0.4s ease-in-out;
          " />
        </div>
        
        <!-- Texto inferior -->
        <div id="slide-5-text-bottom" style="
          font-family: var(--font-family);
          color: var(--fg);
          font-size: 1.1rem;
          line-height: 1.5;
          white-space: pre-wrap;
          text-align: left;
          width: 90%;
          max-width: 90%;
          height: ${isMobile() ? "18vh" : "15vh"};
          min-height: ${isMobile() ? "18vh" : "15vh"};
          max-height: ${isMobile() ? "18vh" : "15vh"};
          flex: 0 0 ${isMobile() ? "18vh" : "15vh"};
          overflow-wrap: break-word;
          word-wrap: break-word;
          overflow: hidden;
          box-sizing: border-box;
        "></div>
      </div>
    `;
  }

  /**
   * Divide el texto en dos partes (arriba y abajo de la imagen)
   */
  splitText(text) {
    if (!text) return { top: "", bottom: "" };

    // Buscar el punto de división (después de "BUT NO LEGACY MEDIA WILL TOUCH IT.")
    const splitPoint = text.indexOf("SO, LIKE WIKILEAKS");

    if (splitPoint > 0) {
      return {
        top: text.substring(0, splitPoint).trim(),
        bottom: text.substring(splitPoint).trim(),
      };
    }

    // Si no encuentra el punto de división, dividir por la mitad
    const lines = text.split("\n");
    const midPoint = Math.floor(lines.length / 2);
    return {
      top: lines.slice(0, midPoint).join("\n").trim(),
      bottom: lines.slice(midPoint).join("\n").trim(),
    };
  }

  onEnter() {
    console.log("🎬 Entering Slide 5 (Correa Photo)");

    // Dividir el texto en dos partes
    const textParts = this.splitText(pages[4]);

    // Mostrar imagen con fade-in
    const imageContainer = document.getElementById("slide-5-image-container");
    if (imageContainer) {
      setTimeout(() => {
        imageContainer.style.opacity = "1";
      }, 50);
    }

    // Animar texto superior
    const textTopElement = document.getElementById("slide-5-text-top");
    if (textTopElement && textParts.top) {
      // Play typing audio
      this.audioHelper.playTypingAudio();

      // Start scramble animation
      this.animationHelper.scrambleText(textTopElement, textParts.top, () => {
        // Cuando termine el texto superior, animar el inferior
        const textBottomElement = document.getElementById(
          "slide-5-text-bottom"
        );
        if (textBottomElement && textParts.bottom) {
          this.animationHelper.scrambleText(
            textBottomElement,
            textParts.bottom,
            () => {
              this.audioHelper.stopTypingAudio();
              console.log("✅ Slide 5 text complete");
            }
          );
        } else {
          this.audioHelper.stopTypingAudio();
        }
      });
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 5");

    // Ocultar imagen
    const imageContainer = document.getElementById("slide-5-image-container");
    if (imageContainer) {
      imageContainer.style.opacity = "0";
    }

    // Stop audio and animations
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }

  cleanup() {
    // Stop audio and animations
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }
}
