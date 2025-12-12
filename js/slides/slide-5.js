/**
 * Slide 5 - Arrest Photo with Text
 * Imagen de arresto con fade in y texto con typewriter
 * 3 líneas de texto encima de la imagen
 */

import { imageSources, isMobile } from "../constants.js";

// 3 líneas de texto separadas
const SLIDE_5_LINES = [
  "IN 2025, THE SIX BILLION DOLLAR MAN WON THE CANNES FILM FESTIVAL AND THE FIRST-EVER GOLDEN GLOBE FOR DOCUMENTARY. BUT NO LEGACY MEDIA WILL TOUCH IT.",
  "SO, LIKE WIKILEAKS, WE ARE TAKING THE FILM DIRECT TO THE PUBLIC.",
  "FOR THIS, WE NEED YOUR HELP.",
];

// Config para animación tipo terminal
const TYPEWRITER_CHAR_DELAY = 15; // ms entre cada caracter
const LINE_DELAY = 1000; // 1 segundo entre líneas
const LAST_LINE_DELAY = 2000; // 2 segundos antes de la última línea (más importancia)

export class Slide5 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.typewriterTimeouts = [];
    this.currentCharInterval = null;
    this.imageFadeInterval = null;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: ${isMobile() ? "5% 6%" : "2% 8%"};
        gap: 0.8rem;
        overflow: hidden;
      ">
        <!-- Texto superior (2 líneas) -->
        <div id="slide-5-text-top" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(0, 221, 0);
          text-shadow: 0px 0px 2px rgb(0, 221, 0), 0px 0px 8px rgb(0, 221, 0), 0px 0px 16px rgb(0, 221, 0);
          filter: saturate(1.3);
          font-size: ${isMobile() ? "0.8rem" : "1.05rem"};
          line-height: 1.4;
          text-align: left;
          width: 90%;
          max-width: 90%;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        ">
          <div id="s5-line-1" class="terminal-line" style="min-height: ${
            isMobile() ? "6em" : "3.5em"
          };"></div>
          <div id="s5-line-2" class="terminal-line" style="min-height: ${
            isMobile() ? "3.5em" : "2em"
          };"></div>
        </div>
        
        <!-- Imagen -->
        <div id="slide-5-image-container" style="
          max-width: ${isMobile() ? "70vw" : "50vw"};
          max-height: ${isMobile() ? "35vh" : "35vh"};
          width: ${isMobile() ? "70vw" : "50vw"};
          height: auto;
          flex: 0 0 auto;
          opacity: 0;
          margin: 1rem 0;
        ">
          <img id="slide-5-image" src="${imageSources.arrest}" style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0);
            display: block;
            opacity: 0.7;
          " />
        </div>
        
        <!-- Texto inferior (última línea - importante) -->
        <div id="slide-5-text-bottom" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(0, 221, 0);
          text-shadow: 0px 0px 2px rgb(0, 221, 0), 0px 0px 8px rgb(0, 221, 0), 0px 0px 16px rgb(0, 221, 0);
          filter: saturate(1.3);
          font-size: ${isMobile() ? "0.9rem" : "1.05rem"};
          line-height: 1.4;
          text-align: center;
          width: 90%;
          max-width: 90%;
        ">
          <div id="s5-line-3" class="terminal-line" style="min-height: ${
            isMobile() ? "2em" : "1.5em"
          };"></div>
        </div>
      </div>
    `;
  }

  /**
   * Efecto typewriter para una línea
   */
  typewriteLine(element, text, onComplete) {
    let charIndex = 0;
    const cursor = "█";

    this.currentCharInterval = setInterval(() => {
      if (charIndex <= text.length) {
        const displayText = text.substring(0, charIndex);
        element.innerHTML =
          displayText +
          (charIndex < text.length
            ? `<span class="cursor">${cursor}</span>`
            : "");
        charIndex++;
      } else {
        clearInterval(this.currentCharInterval);
        this.currentCharInterval = null;
        element.innerHTML = text;
        if (onComplete) onComplete();
      }
    }, TYPEWRITER_CHAR_DELAY);
  }

  /**
   * Anima todas las líneas secuencialmente
   */
  animateAllLines(onComplete) {
    let currentLineIndex = 0;

    const animateNextLine = () => {
      if (currentLineIndex >= SLIDE_5_LINES.length) {
        if (onComplete) onComplete();
        return;
      }

      const lineNumber = currentLineIndex + 1;
      const element = document.getElementById(`s5-line-${lineNumber}`);
      const text = SLIDE_5_LINES[currentLineIndex];

      if (element) {
        this.typewriteLine(element, text, () => {
          currentLineIndex++;
          // Delay más largo antes de la última línea (línea 3)
          const delay = currentLineIndex === 2 ? LAST_LINE_DELAY : LINE_DELAY;
          const timeout = setTimeout(() => {
            animateNextLine();
          }, delay);
          this.typewriterTimeouts.push(timeout);
        });
      } else {
        currentLineIndex++;
        animateNextLine();
      }
    };

    animateNextLine();
  }

  /**
   * Inicia el fade-in gradual de la imagen
   */
  startImageFade() {
    const imageContainer = document.getElementById("slide-5-image-container");
    if (!imageContainer) return;

    const fadeDuration = 3000;
    const fadeSteps = 40;
    const stepDuration = fadeDuration / fadeSteps;
    let currentStep = 0;

    this.imageFadeInterval = setInterval(() => {
      currentStep++;
      const opacity = currentStep / fadeSteps;
      imageContainer.style.opacity = Math.min(opacity, 1).toString();

      if (currentStep >= fadeSteps) {
        clearInterval(this.imageFadeInterval);
        this.imageFadeInterval = null;
        imageContainer.style.opacity = "1";
      }
    }, stepDuration);
  }

  onEnter() {
    console.log("🎬 Entering Slide 5 (Arrest Photo)");

    // Play typing audio
    this.audioHelper.playTypingAudio();

    // Iniciar fade-in gradual de la imagen
    this.startImageFade();

    // Animar todas las líneas secuencialmente
    this.animateAllLines(() => {
      this.audioHelper.stopTypingAudio();
      console.log("✅ Slide 5 text complete");
    });
  }

  onExit() {
    console.log("🚪 Exiting Slide 5");

    // Ocultar imagen
    const imageContainer = document.getElementById("slide-5-image-container");
    if (imageContainer) {
      imageContainer.style.opacity = "0";
    }

    // Stop audio and animations
    this.cleanup();
  }

  cleanup() {
    // Limpiar todos los timeouts
    this.typewriterTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.typewriterTimeouts = [];

    // Limpiar interval del typewriter
    if (this.currentCharInterval) {
      clearInterval(this.currentCharInterval);
      this.currentCharInterval = null;
    }

    // Limpiar interval del fade de imagen
    if (this.imageFadeInterval) {
      clearInterval(this.imageFadeInterval);
      this.imageFadeInterval = null;
    }

    // Stop audio
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }
}
