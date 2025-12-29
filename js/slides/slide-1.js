/**
 * Slide 1 - Title Slide
 * Display instantáneo del texto sin animación
 */

const SLIDE_1_TEXT = `RECIPIENT: DORSEY.6BDM180925

EYES ONLY / NO FWD / 
NO DSTRO

SOURCE: CSF
FILE ID: 369-108-11`;

import { isMobile } from "../constants.js";

export class Slide1 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        height: 100%;
        padding-left: 42px;
        padding-top: 82px;
      ">
        <div id="slide-1-text" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: ${isMobile() ? "27.2px" : "1.8rem"};
          line-height: 1.4 !important;
          white-space: pre-wrap;
          text-align: left;
          max-width: 90%;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 1 (Title)");

    const textElement = document.getElementById("slide-1-text");
    console.log("🔍 DEBUG: slide-1-text element found?", !!textElement);

    if (textElement) {
      const mobile = isMobile();
      const text = mobile
        ? this.animationHelper.wrapTextForMobile(SLIDE_1_TEXT)
        : SLIDE_1_TEXT;

      // Play scramble audio with delay
      setTimeout(() => {
        // Start audio 200ms before animation
        this.audioHelper.playScrambleAudio();

        setTimeout(() => {
          // Start scramble animation with initial delay to show encrypted text first
          this.animationHelper.scrambleText(
            textElement,
            text,
            () => {
              // Stop audio 100ms after animation completes
              setTimeout(() => {
                this.audioHelper.stopScrambleAudio();
              }, 100);
              this.animationHelper.wrapYearsInSpans(textElement);
              console.log("✅ Slide 1 scramble complete");
            },
            false,
            { initialDelayMs: 100 }
          );
        }, 200);
      }, 1000);
    } else {
      console.error("❌ Missing element");
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 1");

    // Clear text content
    const textElement = document.getElementById("slide-1-text");
    if (textElement) textElement.textContent = "";

    // Stop audio and animations
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();
  }

  cleanup() {
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();
  }
}
