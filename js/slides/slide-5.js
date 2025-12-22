/**
 * Slide 5 - Arrest Photo with Text
 * Imagen de arresto con fade in y texto con typewriter
 * 3 líneas de texto encima de la imagen
 */

import { imageSources, isMobile } from "../constants.js";

// 3 líneas de texto (todas arriba de la imagen)
const SLIDE_5_LINES = [
  "2012-2019: ASSANGE TAKES ASYLUM IN ECUADORIAN EMBASSY, LONDON.",
  "2019: HE IS JAILED IN THE UK. AWAITS EXTRADITION TO THE U.S. TO FACE A POSSIBLE 175 YEARS IN PRISON. ",
  "2024: U.S. SUDDENLY DROPS 17 OF ITS 18 COUNTS AGAINST ASSANGE, DISMISSES CASE. ASSANGE PLEADS GUILTY ONLY TO JOURNALISM AND RETURNS TO AUSTRALIA A FREE MAN.",
];

// Config para animación tipo terminal
const TYPEWRITER_CHAR_DELAY = 10; // ms entre cada caracter
const LINE_DELAY = 1000; // 1 segundo entre líneas

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
        position: relative;
        height: 100%;
        display: flex;
        flex-direction: row;
        overflow: hidden;
      ">
        <!-- Texto (3 líneas) - Left side -->
        <div id="slide-5-text-top" style="
          position: absolute;
          left: 0;
          top: 18%;
          z-index: 2;
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: ${isMobile() ? "19.2px" : "1.05rem"};
          line-height: 1.6;
          text-align: left;
          width: 45%;
          padding-left: 5%;
        ">
          <div id="s5-line-1" class="terminal-line" style="margin-bottom: 1.2em;"></div>
          <div id="s5-line-2" class="terminal-line" style="margin-bottom: 1.2em;"></div>
          <div id="s5-line-3" class="terminal-line"></div>
        </div>
        
        <!-- Imagen - Right side, cropped to fit -->
        <img id="slide-5-image" src="${imageSources.correa}" style="
          display: block;
          position: absolute;
          right: 0;
          top: 10%;
          width: 50%;
          height: 75%;
          object-fit: cover;
          z-index: 1;
          opacity: 0;
          filter: brightness(0.7) sepia(1) hue-rotate(60deg) saturate(1.5);
        " />
      </div>
    `;
  }

  /**
   * Efecto typewriter para una línea
   */
  typewriteLine(element, text, onComplete) {
    let charIndex = 0;
    const cursor = "█";

    // Start audio for this line
    this.audioHelper.restartTypingAudio();

    this.currentCharInterval = setInterval(() => {
      if (charIndex <= text.length) {
        const displayText = text.substring(0, charIndex);
        element.innerHTML =
          this.formatLineWithYear(displayText) +
          (charIndex < text.length
            ? `<span class="cursor">${cursor}</span>`
            : "");
        charIndex++;
      } else {
        clearInterval(this.currentCharInterval);
        this.currentCharInterval = null;
        // Stop audio when line is complete
        this.audioHelper.pauseTypingAudio();
        element.innerHTML = this.formatLineWithYear(text);
        if (onComplete) onComplete();
      }
    }, TYPEWRITER_CHAR_DELAY);
  }

  /**
   * Formatea el año en la línea con un span especial
   */
  formatLineWithYear(text) {
    return text.replace(
      /^(\d{4}(?:-\d{4})?:)/,
      '<span class="year-text">$1</span>'
    );
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
          const timeout = setTimeout(() => {
            animateNextLine();
          }, LINE_DELAY);
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
    const image = document.getElementById("slide-5-image");
    if (!image) return;

    const fadeDuration = 0;
    const fadeSteps = 40;
    const stepDuration = fadeDuration / fadeSteps;
    let currentStep = 0;

    this.imageFadeInterval = setInterval(() => {
      currentStep++;
      const opacity = currentStep / fadeSteps;
      image.style.opacity = Math.min(opacity, 1).toString();

      if (currentStep >= fadeSteps) {
        clearInterval(this.imageFadeInterval);
        this.imageFadeInterval = null;
        image.style.opacity = "1";
      }
    }, stepDuration);
  }

  onEnter() {
    console.log("🎬 Entering Slide 5 (Arrest Photo)");

    // Iniciar fade-in gradual de la imagen
    this.startImageFade();

    // Animar todas las líneas secuencialmente (audio se maneja por línea)
    this.animateAllLines(() => {
      this.audioHelper.stopTypingAudio();
      console.log("✅ Slide 5 text complete");
    });
  }

  onExit() {
    console.log("🚪 Exiting Slide 5");

    // Ocultar imagen
    const image = document.getElementById("slide-5-image");
    if (image) {
      image.style.opacity = "0";
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
