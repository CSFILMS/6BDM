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
          color: var(--fg);
          font-family: var(--font-family);
          font-size: 1.5rem;
          text-align: center;
          z-index: 10;
          text-shadow: 0 0 5px var(--fg), 0 0 15px var(--fg);
        ">
          [TRAILER]
        </div>
        
        <!-- Coming soon message -->
        <div style="
          color: var(--accent);
          font-family: var(--font-family);
          font-size: 1.2rem;
          text-align: center;
          text-shadow: 0 0 3px var(--accent), 0 0 10px var(--accent);
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
