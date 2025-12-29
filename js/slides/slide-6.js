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

// Config para animación scramble
const LINE_DELAY = 1000; // 1 segundo entre líneas
const LAST_LINE_DELAY = 1500; // Delay extra antes de la última línea (más importancia)
const SCRAMBLE_CHUNK_SIZE = 4; // Más pequeño = más lento
const SCRAMBLE_INTERVAL = 50; // Más alto = más lento

export class Slide6 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.typewriterTimeouts = [];
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
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: ${isMobile() ? "19.2px" : "1.05rem"};
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
   * Anima todas las líneas secuencialmente con scramble
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
        // Start audio 200ms before animation
        this.audioHelper.playScrambleAudio();
        const animationTimeout = setTimeout(() => {
          this.animationHelper.scrambleText(
            element,
            text,
            () => {
              // Stop audio 100ms after animation completes
              const audioStopTimeout = setTimeout(() => {
                this.audioHelper.stopScrambleAudio();
              }, 100);
              this.typewriterTimeouts.push(audioStopTimeout);
              currentLineIndex++;
              // Delay más largo antes de la última línea (línea 3)
              const delay =
                currentLineIndex === 2 ? LAST_LINE_DELAY : LINE_DELAY;
              const timeout = setTimeout(() => {
                animateNextLine();
              }, delay);
              this.typewriterTimeouts.push(timeout);
            },
            false,
            {
              chunkSize: SCRAMBLE_CHUNK_SIZE,
              intervalMs: SCRAMBLE_INTERVAL,
            }
          );
        }, 100);
        this.typewriterTimeouts.push(animationTimeout);
      } else {
        currentLineIndex++;
        animateNextLine();
      }
    };

    animateNextLine();
  }

  onEnter() {
    console.log("🎬 Entering Slide 6 (Text Only)");

    // Animar todas las líneas secuencialmente con scramble
    this.animateAllLines(() => {
      console.log("✅ Slide 6 text complete");
    });
  }

  onExit() {
    console.log("🚪 Exiting Slide 6");

    // Clear text elements content
    const line1 = document.getElementById("s6-line-1");
    const line2 = document.getElementById("s6-line-2");
    const line3 = document.getElementById("s6-line-3");

    if (line1) line1.textContent = "";
    if (line2) line2.textContent = "";
    if (line3) line3.textContent = "";

    // Stop audio and animations
    this.cleanup();
  }

  cleanup() {
    // Limpiar todos los timeouts
    this.typewriterTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.typewriterTimeouts = [];

    // Stop audio and animations
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();
  }
}
