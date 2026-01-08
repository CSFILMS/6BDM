/**
 * Slide 0 - Start Screen
 * Simple click to start - unlocks audio context
 */

import { isMobile } from "../constants.js";

export class Slide0 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
        width: 100%;
      ">
        <div id="slide-0-text" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: ${isMobile() ? "27.2px" : "1.8rem"};
          line-height: 1.4;
          text-align: center;
          cursor: pointer;
        ">CLICK TO<br>START SEQUENCE</div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 0 (Start Screen)");
    // Nothing to do - just display the text
  }

  onExit() {
    console.log("🚪 Exiting Slide 0");
    // Unlock audio context when leaving this slide
    this.audioHelper.unlockAudioContext();
  }

  cleanup() {
    // Nothing to clean up
  }
}
