/**
 * Slide 7 - Trailer Video
 * Video del trailer con play button
 */

export class Slide7 {
  constructor(audioHelper, animationHelper) {
    this.audioHelper = audioHelper;
    this.animationHelper = animationHelper;
    this.videoElement = null;
    this.isPlaying = false;
  }

  render() {
    return `
      <div class="slide-content" style="
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background: #000;
      ">
        <!-- Video container (hidden until play) -->
        <div id="slide-7-video-container" style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: none;
          align-items: center;
          justify-content: center;
          background: #000;
          overflow: hidden;
          z-index: 5;
        ">
          <video
            id="slide-7-video"
            playsinline
            preload="metadata"
            style="
              width: 100%;
              height: 100%;
              object-fit: contain;
            "
          >
            <!-- Video source will be added later -->
          </video>
        </div>
        
        <!-- Play button container -->
        <div id="slide-7-play-container" style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 30px;
          cursor: pointer;
          z-index: 20;
        ">
          <!-- Play button -->
          <div id="slide-7-play-button" style="
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <div style="
              width: 0;
              height: 0;
              border-left: 50px solid rgb(102, 255, 102);
              border-top: 30px solid transparent;
              border-bottom: 30px solid transparent;
              filter: drop-shadow(0 0 3px rgb(102, 255, 102)) drop-shadow(0 0 8px rgb(102, 255, 102));
            "></div>
          </div>
          
          <!-- Click to watch text -->
          <div id="slide-7-play-text" style="
            color: rgb(102, 255, 102);
            font-family: Crisp, 'Courier New', monospace;
            font-size: 19.2px;
            text-align: center;
            text-shadow: rgb(102, 255, 102) 0px 0px 2px, rgb(102, 255, 102) 0px 0px 12px;
            filter: saturate(0.95);
            letter-spacing: 2px;
          ">
            CLICK TO WATCH TRAILER
          </div>
        </div>
      </div>
    `;
  }

  onEnter() {
    console.log("🎬 Entering Slide 7 (Trailer)");

    const playContainer = document.getElementById("slide-7-play-container");
    const playButton = document.getElementById("slide-7-play-button");
    const videoContainer = document.getElementById("slide-7-video-container");

    // Reset state
    this.isPlaying = false;

    // Show play button, hide video
    if (playContainer) {
      playContainer.style.display = "flex";
    }
    if (videoContainer) {
      videoContainer.style.display = "none";
    }

    // Setup click handlers
    if (playContainer) {
      playContainer.onclick = () => this.playTrailer();
    }
  }

  playTrailer() {
    console.log("▶️ Playing trailer");

    const playContainer = document.getElementById("slide-7-play-container");
    const videoContainer = document.getElementById("slide-7-video-container");
    const video = document.getElementById("slide-7-video");

    // Hide play button
    if (playContainer) {
      playContainer.style.display = "none";
    }

    // Show and play video
    if (videoContainer) {
      videoContainer.style.display = "flex";
    }

    if (video) {
      this.videoElement = video;
      video.play().catch((err) => {
        console.log("⚠️ Video play failed:", err);
        // Show play button again if play fails
        if (playContainer) {
          playContainer.style.display = "flex";
        }
        if (videoContainer) {
          videoContainer.style.display = "none";
        }
      });
      this.isPlaying = true;
    }
  }

  onExit() {
    console.log("🚪 Exiting Slide 7");

    // Stop video if playing
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.currentTime = 0;
    }
    this.isPlaying = false;
  }

  cleanup() {
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.src = "";
      this.videoElement = null;
    }
    this.isPlaying = false;
  }
}
