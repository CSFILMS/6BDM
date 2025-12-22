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
          color: rgb(102, 255, 102);
          font-family: Crisp, 'Courier New', monospace;
          font-size: 19.2px;
          line-height: 1.4;
          text-align: center;
          z-index: 10;
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
        ">
          [TRAILER]
        </div>
        
        <!-- Coming soon message -->
        <div style="
          color: rgb(102, 255, 102);
          font-family: Crisp, 'Courier New', monospace;
          font-size: 19.2px;
          line-height: 1.4;
          text-align: center;
          text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
          filter: saturate(0.95);
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
