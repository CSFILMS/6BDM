/**
 * Slide 1 - Title Slide
 * Display instantáneo del texto sin animación
 */

import { pages, isMobile } from "../constants.js";

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
          font-family: var(--font-family);
          color: var(--fg);
          font-size: ${isMobile() ? "1.0rem" : "1.8rem"};
          line-height: 1.5;
          white-space: pre-wrap;
          text-align: left;
          max-width: 90%;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 1 (Title)");
    console.log("🔍 DEBUG: pages[0] exists?", !!pages[0]);
    console.log("🔍 DEBUG: pages[0] content:", pages[0]?.substring(0, 100));

    const textElement = document.getElementById("slide-1-text");
    console.log("🔍 DEBUG: slide-1-text element found?", !!textElement);

    if (textElement && pages[0]) {
      const mobile = isMobile();
      const text = mobile
        ? this.animationHelper.wrapTextForMobile(pages[0])
        : pages[0];

      // Instant display - no animation
      textElement.textContent = text;
      this.animationHelper.wrapYearsInSpans(textElement);
      console.log("✅ Slide 1 text set");
    } else {
      console.error("❌ Missing element or pages data");
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 1");
  }

  cleanup() {
    // No cleanup needed
  }
}
