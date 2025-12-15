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
        padding-left: 10%;
        padding-top: 20%;
      ">
        <div id="slide-1-text" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(0, 221, 0);
          text-shadow: rgb(0, 221, 0) 0px 0px 2px, rgb(0, 221, 0) 0px 0px 8px, rgb(0, 221, 0) 0px 0px 16px;
          font-size: ${isMobile() ? "19.2px" : "1.8rem"};
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

      // Instant display - no animation
      textElement.textContent = text;
      this.animationHelper.wrapYearsInSpans(textElement);
      console.log("✅ Slide 1 text set");
    } else {
      console.error("❌ Missing element");
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 1");
  }

  cleanup() {
    // No cleanup needed
  }
}
