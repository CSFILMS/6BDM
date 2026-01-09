/**
 * Slide 2 - Scramble Animation with Audio
 * Texto con efecto scramble y audio de typing
 */

const SLIDE_2_TEXT_1 = `THE SIX BILLION DOLLAR
MAN`;

const SLIDE_2_TEXT_2A = `JULIAN ASSANGE AND`;
const SLIDE_2_TEXT_2B = `THE PRICE OF TRUTH`;
// PRESS [F] FOR FULL SCREEN

export class Slide2 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
  }

  render() {
    return `
      <div class="slide-content" style="
        display: flex;
        flex-direction: column;
        height: 100%;
        padding-left: 42px;
        padding-top: 82px;
      ">
        <div id="slide-2-text" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: 27.2px;
          margin-top: -10px;
          line-height: 26.4px !important;
          white-space: pre-wrap;
          text-align: left;
          max-width: 90%;
        "></div>
        <div id="slide-2-text-2a" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: 1.25rem;
          margin-top: 160px;
          line-height: 26.4px !important;
          white-space: nowrap;
          text-align: end;
          max-width: 90%;
        "></div>
        <div id="slide-2-text-2b" style="
          font-family: Crisp, 'Courier New', monospace;
          color: rgb(102, 255, 102);
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
          font-size: 1.25rem;
          margin-top: 4px;
          line-height: 26.4px !important;
          white-space: nowrap;
          text-align: end;
          max-width: 90%;
        "></div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 2 (Scramble with audio)");

    const textElement = document.getElementById("slide-2-text");
    const textElement2a = document.getElementById("slide-2-text-2a");
    const textElement2b = document.getElementById("slide-2-text-2b");

    if (textElement && textElement2a && textElement2b) {
      // Play scramble audio
      setTimeout(() => {
        // Start audio 200ms before animation
        this.audioHelper.playScrambleAudio();

        setTimeout(() => {
          // Start scramble animation for first text
          this.animationHelper.scrambleText(
            textElement,
            SLIDE_2_TEXT_1,
            () => {
              // Stop audio after first animation
              this.audioHelper.stopScrambleAudio();

              // Wait 1s before animating second text (2a)
              setTimeout(() => {
                // Resume audio for second animation (2a)
                this.audioHelper.playScrambleAudio();

                this.animationHelper.scrambleText(
                  textElement2a,
                  SLIDE_2_TEXT_2A,
                  () => {
                    // Stop audio after 2a animation
                    this.audioHelper.stopScrambleAudio();

                    // Wait 300ms before animating text 2b
                    setTimeout(() => {
                      // Resume audio for 2b animation
                      this.audioHelper.playScrambleAudio();

                      this.animationHelper.scrambleText(
                        textElement2b,
                        SLIDE_2_TEXT_2B,
                        () => {
                          // Stop audio 300ms after animation completes
                          setTimeout(() => {
                            this.audioHelper.stopScrambleAudio();
                          }, 100);
                          console.log("✅ Slide 2 scramble complete");
                        },
                        false,
                        { initialDelayMs: 200, chunkSize: 7, intervalMs: 40 }
                      );
                    }, 300);
                  },
                  false,
                  { initialDelayMs: 200, chunkSize: 7, intervalMs: 40 }
                );
              }, 1000);
            },
            false,
            { initialDelayMs: 0, chunkSize: 4, intervalMs: 60 }
          );
        }, 200);
      }, 1000);
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 2");

    // Clear text content
    const textElement = document.getElementById("slide-2-text");
    const textElement2a = document.getElementById("slide-2-text-2a");
    const textElement2b = document.getElementById("slide-2-text-2b");
    if (textElement) textElement.textContent = "";
    if (textElement2a) textElement2a.textContent = "";
    if (textElement2b) textElement2b.textContent = "";

    // Stop audio and animations
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();
  }

  cleanup() {
    this.audioHelper.stopScrambleAudio();
    this.animationHelper.clearAnimations();
  }
}
