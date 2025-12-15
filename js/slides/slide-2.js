/**
 * Slide 2 - Scramble Animation with Audio
 * Texto con efecto scramble y audio de typing
 */

const SLIDE_2_TEXT = `THE SIX BILLION DOLLAR
MAN


PRESS [F] FOR FULL SCREEN`;

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
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(0, 221, 0);
          text-shadow: rgb(0, 221, 0) 0px 0px 2px, rgb(0, 221, 0) 0px 0px 8px, rgb(0, 221, 0) 0px 0px 16px;
          filter: saturate(1.3);
          font-size: 1.05rem;
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
    if (textElement) {
      // Play typing audio
      this.audioHelper.playTypingAudio();

      // Start scramble animation
      this.animationHelper.scrambleText(textElement, SLIDE_2_TEXT, () => {
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
