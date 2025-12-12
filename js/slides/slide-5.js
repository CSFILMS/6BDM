/**
 * Slide 5 - Correa Photo with Text
 * Imagen de Rafael Correa con fade in y texto con typewriter
 * 3 líneas arriba de la imagen, 2 líneas abajo
 */

import { imageSources, isMobile } from "../constants.js";

// 5 líneas de texto separadas
const SLIDE_5_LINES = [
  "2006: JULIAN ASSANGE BUILDS WIKILEAKS TO ENABLE WHISTLEBLOWERS TO INFORM THE PUBLIC.",
  "2010: WIKILEAKS RELEASES LARGEST TROVE OF U.S. MILITARY SECRETS IN HISTORY, EXPOSING U.S. WAR CRIMES.",
  "2012-2019: U.S. AUTHORITIES CHARGE ASSANGE WITH ESPIONAGE. HE TAKES ASYLUM IN ECUADORIAN EMBASSY, LONDON.",
  "2019: ASSANGE IS IMPRISONED IN THE UK FOR FIVE YEARS. AWAITS EXTRADITION TO THE U.S TO FACE A FURTHER 175.",
  "2024: U.S. SUDDENLY DROPS 17 OF ITS 18 COUNTS AGAINST ASSANGE, DISMISSES CASE. ASSANGE PLEADS GUILTY ONLY TO JOURNALISM AND RETURNS TO AUSTRALIA A FREE MAN.",
];

// Config para animación tipo terminal
const TYPEWRITER_CHAR_DELAY = 15; // ms entre cada caracter
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
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: ${isMobile() ? "5% 6%" : "2% 8%"};
        gap: 0.5rem;
        overflow: hidden;
      ">
        <!-- Texto superior (3 líneas) -->
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
          gap: 0.3rem;
        ">
          <div id="line-1" class="terminal-line" style="min-height: ${
            isMobile() ? "3em" : "1.8em"
          };"></div>
          <div id="line-2" class="terminal-line" style="min-height: ${
            isMobile() ? "4.5em" : "2.8em"
          };"></div>
          <div id="line-3" class="terminal-line" style="min-height: ${
            isMobile() ? "4.5em" : "2.8em"
          };"></div>
        </div>
        
        <!-- Imagen -->
        <div id="slide-5-image-container" style="
          max-width: ${isMobile() ? "60vw" : "40vw"};
          max-height: ${isMobile() ? "22vh" : "22vh"};
          width: ${isMobile() ? "60vw" : "40vw"};
          height: auto;
          flex: 0 0 auto;
          opacity: 0;
          margin: 0.5rem 0;
        ">
          <img id="slide-5-image" src="${imageSources.correa}" style="
            width: 100%;
            height: 100%;
            object-fit: contain;
            filter: brightness(0.8) sepia(1) hue-rotate(60deg) saturate(4.0);
            display: block;
            opacity: 0.7;
          " />
        </div>
        
        <!-- Texto inferior (2 líneas) -->
        <div id="slide-5-text-bottom" style="
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
          gap: 0.3rem;
        ">
          <div id="line-4" class="terminal-line" style="min-height: ${
            isMobile() ? "4.5em" : "2.8em"
          };"></div>
          <div id="line-5" class="terminal-line" style="min-height: ${
            isMobile() ? "6em" : "3.5em"
          };"></div>
        </div>
      </div>
    `;
  }

  /**
   * Efecto typewriter para una línea
   * @param {HTMLElement} element - Elemento donde escribir
   * @param {string} text - Texto a escribir
   * @param {function} onComplete - Callback al terminar
   */
  typewriteLine(element, text, onComplete) {
    let charIndex = 0;
    const cursor = "█";

    this.currentCharInterval = setInterval(() => {
      if (charIndex <= text.length) {
        // Mostrar texto + cursor parpadeante
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
        // Texto final sin cursor
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
      const element = document.getElementById(`line-${lineNumber}`);
      const text = SLIDE_5_LINES[currentLineIndex];

      if (element) {
        this.typewriteLine(element, text, () => {
          currentLineIndex++;
          // Delay de 1 segundo antes de la siguiente línea
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
    const imageContainer = document.getElementById("slide-5-image-container");
    if (!imageContainer) return;

    // Fade más rápido: 3 segundos en lugar de toda la animación
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
    console.log("🎬 Entering Slide 5 (Correa Photo)");

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
