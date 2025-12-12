/**
 * Slide 3 - Delayed Scramble Animation
 * Texto con efecto scramble con delay y audio de typing
 */

const SLIDE_3_TEXT = `6BDM: JULIAN ASSANGE AND THE PRICE OF TRUTH`;

export class Slide3 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.delayTimeout = null;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      ">
        <div id="slide-3-text" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(0, 221, 0);
          text-shadow: 0px 0px 2px rgb(0, 221, 0), 0px 0px 8px rgb(0, 221, 0), 0px 0px 16px rgb(0, 221, 0);
          filter: saturate(1.3);
          font-size: 1.05rem;
          line-height: 1.5;
          white-space: pre-wrap;
          text-align: center; 
          max-width: 90%;
          word-spacing: 0.3em;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 3 (Delayed scramble)");

    const textElement = document.getElementById("slide-3-text");
    if (textElement) {
      // Wait 750ms before starting animation
      this.delayTimeout = setTimeout(() => {
        console.log("🎯 Starting delayed scramble for Slide 3");

        // Play typing audio
        this.audioHelper.playTypingAudio();

        // Start scramble animation with slower, smoother effect
        this.animationHelper.scrambleText(
          textElement,
          SLIDE_3_TEXT,
          () => {
            // Stop audio when animation completes
            this.audioHelper.stopTypingAudio();
            console.log("✅ Slide 3 scramble complete");
          },
          false,
          {
            chunkSize: 3, // Reveal fewer characters per step
            intervalMs: 80, // Smooth interval
          }
        );
      }, 750);
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 3");

    // Clear delay timeout
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
    }

    // Stop audio and animations
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }

  cleanup() {
    if (this.delayTimeout) {
      clearTimeout(this.delayTimeout);
      this.delayTimeout = null;
    }
    this.audioHelper.stopTypingAudio();
    this.animationHelper.clearAnimations();
  }
}
