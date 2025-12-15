/**
 * Slide 6 - Text Only (Documentary info)
 * Solo texto con typewriter, sin imagen
 * 3 líneas de texto centradas
 */

import { isMobile } from "../constants.js";

// 3 líneas de texto separadas
const SLIDE_6_LINES = [
  "IN 2025, THE SIX BILLION DOLLAR MAN WON THE CANNES FILM FESTIVAL AND THE FIRST-EVER GOLDEN GLOBE FOR DOCUMENTARY. BUT NO LEGACY MEDIA WILL TOUCH IT.",
  "SO, LIKE WIKILEAKS, WE ARE TAKING THE FILM DIRECT TO THE PUBLIC.",
  "FOR THIS, WE NEED YOUR HELP.",
];

// Config para animación tipo terminal
const TYPEWRITER_CHAR_DELAY = 15; // ms entre cada caracter
const LINE_DELAY = 1000; // 1 segundo entre líneas
const LAST_LINE_DELAY = 2000; // 2 segundos antes de la última línea (más importancia)

export class Slide6 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.typewriterTimeouts = [];
    this.currentCharInterval = null;
  }

  render() {
    return `
      <div class="slide-content" style="
        height: 100%;
        padding-left: 5%;
        padding-right: 5%;
        padding-top: 20%;
        overflow: hidden;
      ">
        <!-- Texto (3 líneas, sin imagen) -->
        <div id="slide-6-text" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(0, 221, 0);
          text-shadow: rgb(0, 221, 0) 0px 0px 2px, rgb(0, 221, 0) 0px 0px 8px, rgb(0, 221, 0) 0px 0px 16px;
          filter: saturate(1.3);
          font-size: ${isMobile() ? "1.2em" : "1.05rem"};
          line-height: 1.4;
          text-align: left;
          width: 90%;
          max-width: 90%;
        ">
          <div id="s6-line-1" class="terminal-line" style="margin-bottom: 1em;"></div>
          <div id="s6-line-2" class="terminal-line" style="margin-bottom: 1em;"></div>
          <div id="s6-line-3" class="terminal-line"></div>
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

    // Start audio for this line
    this.audioHelper.restartTypingAudio();

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
        // Stop audio when line is complete
        this.audioHelper.pauseTypingAudio();
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
      if (currentLineIndex >= SLIDE_6_LINES.length) {
        if (onComplete) onComplete();
        return;
      }

      const lineNumber = currentLineIndex + 1;
      const element = document.getElementById(`s6-line-${lineNumber}`);
      const text = SLIDE_6_LINES[currentLineIndex];

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

  onEnter() {
    console.log("🎬 Entering Slide 6 (Text Only)");

    // Animar todas las líneas secuencialmente (audio se maneja por línea)
    this.animateAllLines(() => {
      this.audioHelper.stopTypingAudio();
      console.log("✅ Slide 6 text complete");
    });
  }

  onExit() {
    console.log("🚪 Exiting Slide 6");

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

    // Stop audio
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }
}
