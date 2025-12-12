/**
 * Slide 7 - Trailer Video
 * Video del trailer con autoplay
 */

export class Slide7 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
  }

  render() {
    return `
      <div class="slide-content" style="
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #000;
      ">
        <!-- Trailer text -->
        <div id="slide-7-text" style="
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          color: rgb(0, 221, 0);
          font-family: Crisp, 'Courier New', monospace;
          font-size: 1.05rem;
          text-align: center;
          z-index: 10;
          text-shadow: 0px 0px 2px rgb(0, 221, 0), 0px 0px 8px rgb(0, 221, 0), 0px 0px 16px rgb(0, 221, 0);
          filter: saturate(1.3);
        ">
          [TRAILER]
        </div>
        
        <!-- Coming soon message -->
        <div style="
          color: rgb(0, 221, 0);
          font-family: Crisp, 'Courier New', monospace;
          font-size: 1.05rem;
          text-align: center;
          text-shadow: 0px 0px 2px rgb(0, 221, 0), 0px 0px 8px rgb(0, 221, 0), 0px 0px 16px rgb(0, 221, 0);
          filter: saturate(1.3);
        ">
          Trailer video coming soon...
        </div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 7 (Trailer)");

    // TODO: Implement trailer video autoplay when trailer file is available
    // For now, just show placeholder text
  }

  onExit() {
    console.log("🚪 Exiting Slide 7");

    // Stop any playing video/audio when implemented
  }

  cleanup() {
    // Cleanup video resources when implemented
  }
}
