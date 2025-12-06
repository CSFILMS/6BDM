/**
 * Slide 2 - Scramble Animation with Audio
 * Texto con efecto scramble y audio de typing
 */

import { pages } from "../constants.js";

export class Slide2 {
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
        <div id="slide-2-text" style="
          font-family: var(--font-family);
          color: var(--fg);
          font-size: 1.2rem;
          line-height: 1.5;
          white-space: pre-wrap;
          text-align: left;
          max-width: 90%;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 2 (Scramble with audio)");

    const textElement = document.getElementById("slide-2-text");
    if (textElement && pages[1]) {
      // Play typing audio
      this.audioHelper.playTypingAudio();

      // Start scramble animation
      this.animationHelper.scrambleText(textElement, pages[1], () => {
        // Stop audio when animation completes
        this.audioHelper.stopTypingAudio();
        console.log("✅ Slide 2 scramble complete");
      });
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 2");

    // Stop audio and animations
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }

  cleanup() {
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }
}
