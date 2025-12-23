/**
 * Slide 4 - Correa Photo with Text
 * Imagen de Rafael Correa con fade in y texto con typewriter
 * 3 líneas arriba de la imagen, 2 líneas abajo
 */

import { imageSources, isMobile } from "../constants.js";

// 3 líneas de texto (todas arriba de la imagen)
const SLIDE_4_LINES = [
  "2006: JULIAN ASSANGE BUILDS WIKILEAKS TO HELP WHISTLEBLOWERS INFORM THE PUBLIC.",
  "2010: WIKILEAKS RELEASES LARGEST TROVE OF U.S. SECRETS IN HISTORY. EXPOSES U.S. WAR CRIMES.",
  "U.S. AUTHORITIES CHARGE ASSANGE WITH ESPIONAGE.",
];

// Config para animación tipo terminal
const TYPEWRITER_CHAR_DELAY = 24; // ms entre cada caracter
const THIRD_LINE_CHAR_DELAY = 35; // ms entre cada caracter para la tercera línea
const LINE_DELAY = 1000; // 1 segundo entre líneas
const THIRD_LINE_DELAY = 2200; // Delay extra antes de la tercera línea
const FIRST_LINE_BIG_FONT_SIZE = "27.2px"; // Font size grande para primera línea
const NORMAL_FONT_SIZE = isMobile() ? "18.2px" : "1.05rem"; // Font size normal
const SLIDE_4_INITIAL_DELAY = 1050; // Delay antes de empezar la animación
const SLIDE_4_SCRAMBLE_CHUNK_SIZE = 4; // Más pequeño = más lento
const SLIDE_4_SCRAMBLE_INTERVAL = 50; // Más alto = más lento

export class Slide4 {
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
        <div id="slide-4-text-top" style="
          position: absolute;
          left: 0;
          top: 82px;
          z-index: 2;
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: ${NORMAL_FONT_SIZE};
          line-height: 1.6;
          text-align: left;
          width: 67%;
          padding-left: 42px;
        ">
          <div id="s4-line-1" class="terminal-line" style="margin-bottom: 1.2em; font-size: ${FIRST_LINE_BIG_FONT_SIZE};"></div>
          <div id="s4-line-2" class="terminal-line" style="margin-bottom: 1.2em; opacity: 0;"></div>
          <div id="s4-line-3" class="terminal-line" style="opacity: 0;"></div>
        </div>
        
        <!-- Imagen - Right side, cropped to fit -->
        <img id="slide-4-image" src="${imageSources.first_correa}" style="
          display: block;
          position: absolute;
          right: -40px;
          top: 20%;
          width: 60%;
          height: 75%;
          object-fit: cover;
          object-position: 45% center;
          z-index: 1;
          opacity: 0;
          filter: brightness(0.7) sepia(1) hue-rotate(60deg) saturate(1.5);
          -webkit-mask-image: linear-gradient(to right, transparent 0%, black 25%, black 85%, transparent 100%),
                              linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask-composite: source-in;
          mask-image: linear-gradient(to right, transparent 0%, black 25%, black 85%, transparent 100%),
                      linear-gradient(to bottom, transparent 0%, black 8%, black 92%, transparent 100%);
          mask-composite: intersect;
        " />
      </div>
    `;
  }

  /**
   * Efecto typewriter para una línea
   * @param {HTMLElement} element - Elemento donde escribir
   * @param {string} text - Texto a escribir
   * @param {function} onComplete - Callback al terminar
   * @param {number} charDelay - Delay entre caracteres (opcional)
   */
  typewriteLine(element, text, onComplete, charDelay = TYPEWRITER_CHAR_DELAY) {
    let charIndex = 0;
    const cursor = "█";

    // Start audio for this line
    this.audioHelper.restartTypingAudio();

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
        // Stop audio when line is complete
        this.audioHelper.pauseTypingAudio();
        // Texto final sin cursor
        element.innerHTML = this.formatLineWithYear(text);
        if (onComplete) onComplete();
      }
    }, charDelay);
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
   * Anima las líneas 2 y 3 con typewriter (después del scramble de la línea 1)
   */
  animateRemainingLines(onComplete) {
    // Índice 1 = línea 2, índice 2 = línea 3
    let currentLineIndex = 1;

    const animateNextLine = () => {
      if (currentLineIndex >= SLIDE_4_LINES.length) {
        if (onComplete) onComplete();
        return;
      }

      const lineNumber = currentLineIndex + 1;
      const element = document.getElementById(`s4-line-${lineNumber}`);
      const text = SLIDE_4_LINES[currentLineIndex];

      if (element) {
        // Hacer visible la línea
        element.style.opacity = "1";

        // Usar char delay más lento para la tercera línea (índice 2)
        const charDelay =
          currentLineIndex === 2
            ? THIRD_LINE_CHAR_DELAY
            : TYPEWRITER_CHAR_DELAY;

        this.typewriteLine(
          element,
          text,
          () => {
            currentLineIndex++;
            // Delay antes de la siguiente línea (más largo antes de la línea 3)
            const delay =
              currentLineIndex === 2 ? THIRD_LINE_DELAY : LINE_DELAY;
            const timeout = setTimeout(() => {
              animateNextLine();
            }, delay);
            this.typewriterTimeouts.push(timeout);
          },
          charDelay
        );
      } else {
        currentLineIndex++;
        animateNextLine();
      }
    };

    animateNextLine();
  }

  /**
   * Muestra la imagen instantáneamente
   */
  startImageFade() {
    const image = document.getElementById("slide-4-image");
    if (!image) return;
    image.style.opacity = "1";
    image.style.transition = "opacity 0.3s ease-in-out";
  }

  onEnter() {
    console.log("🎬 Entering Slide 4 (Correa Photo)");

    const line1Element = document.getElementById("s4-line-1");

    if (line1Element) {
      // Delay inicial antes de empezar la animación
      const initialTimeout = setTimeout(() => {
        // Paso 1: Primera línea con scramble (font grande, más lento)
        this.audioHelper.playTypingAudio();

        this.animationHelper.scrambleText(
          line1Element,
          SLIDE_4_LINES[0],
          () => {
            // Scramble completado
            this.audioHelper.stopTypingAudio();
            console.log("✅ Slide 4 first line scramble complete");

            // Paso 2: Delay antes de reducir font-size y mostrar imagen
            const transitionTimeout = setTimeout(() => {
              line1Element.style.fontSize = NORMAL_FONT_SIZE;
              setTimeout(() => {
                this.startImageFade();
              }, 800);

              // Mover el contenedor de texto a su posición final
              const textContainer = document.getElementById("slide-4-text-top");
              if (textContainer) {
                textContainer.style.paddingTop = "8px";
                textContainer.style.width = "45%";
              }

              // Imagen + líneas 2 y 3 con pequeño delay
              const timeout = setTimeout(() => {
                this.startImageFade();
                this.animateRemainingLines(() => {
                  this.audioHelper.stopTypingAudio();
                  console.log("✅ Slide 4 text complete");
                });
              }, 2600);
              this.typewriterTimeouts.push(timeout);
            }, 700);
            this.typewriterTimeouts.push(transitionTimeout);
          },
          false,
          {
            initialDelayMs: 100,
            chunkSize: SLIDE_4_SCRAMBLE_CHUNK_SIZE,
            intervalMs: SLIDE_4_SCRAMBLE_INTERVAL,
          }
        );
      }, SLIDE_4_INITIAL_DELAY);
      this.typewriterTimeouts.push(initialTimeout);
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 4");

    // Ocultar imagen
    const image = document.getElementById("slide-4-image");
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
