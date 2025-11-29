/**
 * Animation Manager
 * Handles text scrambling animations, typewriter effects, and line-by-line reveals
 *
 * NOTE: Some animations could be replaced with CSS animations for better performance.
 * Consider using CSS keyframes for simple fade-in/out effects instead of JS intervals.
 * The scrambling effect might benefit from requestAnimationFrame batching for smoother performance.
 */

import { chars, animationConfig, isMobile } from "./constants.js";

export class AnimationManager {
  constructor(audioManager) {
    this.audioManager = audioManager;
    this.isAnimating = false;
    this.currentInterval = null;
    this.currentAnimationFrame = null;
    this.scramblingDisabled = false;
    this.currentTypingInterval = null;
    this.shouldContinueTyping = true;
    this.lineRevealState = {
      lines: [],
      currentIndex: 0,
      element: null,
      onComplete: null,
    };
    this.isInLineRevealMode = false;
    this.lineRevealTimeouts = [];
  }

  /**
   * Create optimized animation using requestAnimationFrame
   */
  createRAFAnimation(callback, interval = 100) {
    let lastTime = 0;
    let animationId = null;

    const animate = (currentTime) => {
      if (currentTime - lastTime >= interval) {
        const shouldContinue = callback(currentTime - lastTime);
        lastTime = currentTime;

        if (shouldContinue === false) {
          this.currentAnimationFrame = null;
          return;
        }
      }

      animationId = requestAnimationFrame(animate);
      this.currentAnimationFrame = animationId;
    };

    animationId = requestAnimationFrame(animate);
    this.currentAnimationFrame = animationId;

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
        this.currentAnimationFrame = null;
      }
    };
  }

  /**
   * Mobile text wrapping - breaks long lines intelligently
   */
  wrapTextForMobile(text) {
    const mobile = isMobile();
    if (!mobile) return text;

    const lines = text.split("\n");
    const wrappedLines = [];
    const maxLineLength = 40; // Shorter for better mobile readability

    for (const line of lines) {
      if (line.length <= maxLineLength) {
        wrappedLines.push(line);
      } else {
        const indent = line.match(/^(\s*)/)?.[1] || "";
        const hasBullet = line.match(/^(\s*>\s*)/)?.[1] || "";
        const content = line.replace(/^(\s*>\s*)/, "");

        if (content.length <= maxLineLength) {
          wrappedLines.push(line);
        } else {
          const words = content.split(" ");
          let currentLine = indent + hasBullet;
          let isFirstLine = true;

          for (const word of words) {
            const testLine =
              currentLine +
              (currentLine.endsWith(indent + hasBullet) ? "" : " ") +
              word;

            if (testLine.length > maxLineLength) {
              if (currentLine.trim() !== (indent + hasBullet).trim()) {
                wrappedLines.push(currentLine);
                currentLine = indent + "  " + word;
                isFirstLine = false;
              } else {
                currentLine += word;
              }
            } else {
              currentLine +=
                (currentLine.endsWith(indent + hasBullet) ? "" : " ") + word;
            }
          }

          if (currentLine.trim() !== (indent + hasBullet).trim()) {
            wrappedLines.push(currentLine);
          }
        }
      }
    }

    return wrappedLines.join("\n");
  }

  /**
   * Wrap years in spans for styling
   */
  wrapYearsInSpans(element) {
    if (!element) return;

    let text = element.textContent;
    const yearRegex = /(\d{4}(?:-\d{4})?):/g;
    const wrappedText = text.replace(
      yearRegex,
      '<span class="year-text">$1:</span>'
    );
    element.innerHTML = wrappedText;
  }

  /**
   * Truncate text to fit (currently just sets content)
   */
  truncateTextToFit(element, text) {
    element.textContent = text;
  }

  /**
   * Fast scrambling animation
   */
  scrambleFastChunks(element, text, currentPage, onComplete) {
    // Check if scrambling is disabled or if we're after slide 3
    if (this.scramblingDisabled || currentPage > 2) {
      console.log(
        "🔒 Scrambling disabled - displaying text instantly (after slide 3)"
      );
      element.textContent = text;
      this.wrapYearsInSpans(element);
      onComplete && onComplete();
      return;
    }

    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }

    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }

    // Apply mobile text wrapping before processing (skip slides 5-6)
    if (currentPage !== 4 && currentPage !== 5) {
      text = this.wrapTextForMobile(text);
    }

    let index = 0;
    const chunkSize = animationConfig.scrambleChunkSize;
    const scrambled = text.split("");
    const len = text.length;

    for (let i = 0; i < len; i++) {
      scrambled[i] = /\s/.test(text[i])
        ? text[i]
        : chars[Math.floor(Math.random() * chars.length)];
    }

    this.isAnimating = true;
    const promptElem = document.getElementById("prompt");
    const navMsg = document.getElementById("nav-msg");
    if (promptElem) promptElem.style.visibility = "hidden";
    if (navMsg) navMsg.style.visibility = "hidden";

    // Only play unscramble audio on slide 2 (pageIndex 1)
    if (currentPage === 1) {
      this.audioManager.playUnscrambleAudio();
    } else {
      console.log("🔇 Skipping unscramble audio - not on slide 2");
    }

    // Use requestAnimationFrame for better performance
    const stopAnimation = this.createRAFAnimation(() => {
      const display = scrambled.slice();
      for (let i = 0; i < index; i++) {
        let s = i * chunkSize;
        let e = Math.min(s + chunkSize, len);
        for (let j = s; j < e; j++) display[j] = text[j];
      }
      for (let k = index * chunkSize; k < len; k++) {
        display[k] = /\s/.test(text[k])
          ? text[k]
          : chars[Math.floor(Math.random() * chars.length)];
      }
      element.textContent = display.join("");

      index++;
      if (index * chunkSize >= len) {
        stopAnimation();
        this.truncateTextToFit(element, text);
        this.isAnimating = false;

        // Stop unscramble audio
        this.audioManager.stopUnscrambleAudio();

        // Wrap years in spans for styling
        this.wrapYearsInSpans(element);

        // Check if this text contains "A FILM BY" and trigger callback
        if (text.includes("A FILM BY EUGENE JARECKI")) {
          console.log("A FILM BY detected - triggering video callback");
          element.textContent = "";
          onComplete && onComplete();
        } else {
          onComplete && onComplete();
        }

        return false; // Stop animation
      }
      return true; // Continue animation
    }, animationConfig.scrambleIntervalMs);
  }

  /**
   * Ultra-fast scrambling animation (4x faster)
   */
  scrambleUltraFastChunks(element, text, currentPage, onComplete) {
    // Check if scrambling is disabled or if we're after slide 3
    if (this.scramblingDisabled || currentPage > 2) {
      console.log(
        "🔒 Scrambling disabled - displaying text instantly (after slide 3)"
      );
      element.textContent = text;
      this.wrapYearsInSpans(element);
      onComplete && onComplete();
      return;
    }

    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }

    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }

    // Apply mobile text wrapping before processing (skip slides 5-6)
    if (currentPage !== 4 && currentPage !== 5) {
      text = this.wrapTextForMobile(text);
    }

    let index = 0;
    const chunkSize = animationConfig.scrambleChunkSize;
    const scrambled = text.split("");
    const len = text.length;

    for (let i = 0; i < len; i++) {
      scrambled[i] = /\s/.test(text[i])
        ? text[i]
        : chars[Math.floor(Math.random() * chars.length)];
    }

    this.isAnimating = true;
    const promptElem = document.getElementById("prompt");
    const navMsg = document.getElementById("nav-msg");
    if (promptElem) promptElem.style.visibility = "hidden";
    if (navMsg) navMsg.style.visibility = "hidden";

    // Only play unscramble audio on slide 2 (pageIndex 1)
    if (currentPage === 1) {
      this.audioManager.playUnscrambleAudio();
    } else {
      console.log("🔇 Skipping unscramble audio - not on slide 2");
    }

    // Use requestAnimationFrame with ultra-fast timing
    const stopAnimation = this.createRAFAnimation(() => {
      const display = scrambled.slice();
      for (let i = 0; i < index; i++) {
        let s = i * chunkSize;
        let e = Math.min(s + chunkSize, len);
        for (let j = s; j < e; j++) display[j] = text[j];
      }
      for (let k = index * chunkSize; k < len; k++) {
        display[k] = /\s/.test(text[k])
          ? text[k]
          : chars[Math.floor(Math.random() * chars.length)];
      }
      element.textContent = display.join("");

      index++;
      if (index * chunkSize >= len) {
        stopAnimation();
        this.truncateTextToFit(element, text);
        this.isAnimating = false;

        // Stop unscramble audio
        this.audioManager.stopUnscrambleAudio();

        // Wrap years in spans for styling
        this.wrapYearsInSpans(element);

        onComplete && onComplete();
        return false; // Stop animation
      }
      return true; // Continue animation
    }, animationConfig.ultraFastScrambleIntervalMs); // Ultra-fast: 25ms interval
  }

  /**
   * Typewriter effect for subtitle text
   */
  decodeSubtitle(element, baseText, subtitleText, onComplete) {
    // Check if we should even start typing
    if (!this.shouldContinueTyping) {
      console.log("🛑 Typing cancelled - page navigation detected");
      return;
    }

    // Clear any existing typing animation first
    if (this.currentTypingInterval) {
      clearInterval(this.currentTypingInterval);
      this.currentTypingInterval = null;
      console.log("🧹 Cleared previous typing animation");
    }

    let charIndex = 0;
    const len = subtitleText.length;

    console.log("Starting subtitle typewriter animation...");

    this.currentTypingInterval = setInterval(() => {
      // Check if we should continue typing
      if (!this.shouldContinueTyping) {
        console.log("🛑 Typing cancelled mid-animation");
        clearInterval(this.currentTypingInterval);
        this.currentTypingInterval = null;
        return;
      }

      const currentText = subtitleText.substring(0, charIndex + 1);

      // Check if this is the 6BDM text and format it with different sizes
      if (
        subtitleText.includes("6BDM:") &&
        subtitleText.includes("JULIAN ASSANGE")
      ) {
        const parts = currentText.split("\n");
        if (parts.length > 1) {
          element.innerHTML =
            parts[0] +
            '<br><span style="font-size: 0.75em;">' +
            parts[1] +
            "</span>";
        } else {
          element.textContent = currentText;
        }
      } else {
        element.textContent = baseText + currentText;
      }

      charIndex++;
      if (charIndex >= len) {
        clearInterval(this.currentTypingInterval);
        this.currentTypingInterval = null;
        // Final clean text with formatting
        if (
          subtitleText.includes("6BDM:") &&
          subtitleText.includes("JULIAN ASSANGE")
        ) {
          const parts = subtitleText.split("\n");
          element.innerHTML =
            parts[0] +
            '<br><span style="font-size: 0.75em;">' +
            parts[1] +
            "</span>";
        } else {
          element.textContent = baseText + subtitleText;
        }
        console.log("Subtitle typewriter complete");
        if (this.shouldContinueTyping) {
          onComplete && onComplete();
        }
      }
    }, animationConfig.typewriterCharDelayMs);
  }

  /**
   * Line-by-line reveal animation
   */
  revealLineByLine(element, text, onComplete) {
    // Clear any existing intervals and timeouts
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }

    // Clear any existing line reveal timeouts
    this.lineRevealTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.lineRevealTimeouts = [];

    this.isAnimating = true;
    this.isInLineRevealMode = true;
    const promptElem = document.getElementById("prompt");
    if (promptElem) promptElem.style.visibility = "hidden";

    const lines = text.split("\n").filter((line) => line.trim() !== "");
    element.textContent = "";

    // Set up line reveal state
    this.lineRevealState = {
      lines: lines,
      currentIndex: 0,
      element: element,
      onComplete: onComplete,
    };

    console.log("Starting manual line-by-line reveal...");
    console.log(`Total lines to reveal: ${lines.length}`);

    // Show the first line immediately
    this.showNextLineManual();
  }

  /**
   * Show next line in manual reveal mode
   */
  showNextLineManual() {
    const navMsg = document.getElementById("nav-msg");

    if (this.lineRevealState.currentIndex < this.lineRevealState.lines.length) {
      const currentLine =
        this.lineRevealState.lines[this.lineRevealState.currentIndex];
      const lineNumber = this.lineRevealState.currentIndex + 1;

      // Determine if this line should be decoded (only first line)
      const shouldDecode = this.lineRevealState.currentIndex === 0;

      if (shouldDecode) {
        console.log(`Decoding line ${lineNumber}: "${currentLine}"`);

        let previousContent = "";
        if (this.lineRevealState.currentIndex > 0) {
          previousContent = this.lineRevealState.element.textContent + "\n\n";
        }

        // Display line instantly
        this.lineRevealState.element.textContent =
          previousContent + currentLine;
        setTimeout(() => {
          this.lineRevealState.currentIndex++;

          if (
            this.lineRevealState.currentIndex >=
            this.lineRevealState.lines.length
          ) {
            console.log("All lines revealed, finishing...");
            this.isAnimating = false;
            this.isInLineRevealMode = false;
            this.lineRevealState.onComplete &&
              this.lineRevealState.onComplete();
          } else {
            if (navMsg) {
              navMsg.innerHTML = "PRESS SPACEBAR<br>TO ENTER";
              navMsg.style.fontSize = "0.9rem";
              navMsg.style.textAlign = "center";
              navMsg.style.visibility = "visible";
            }
          }
        }, 50);
      } else {
        // Show instantly for later lines (no decoding)
        if (this.lineRevealState.currentIndex > 0) {
          this.lineRevealState.element.textContent += "\n\n";
        }
        this.lineRevealState.element.textContent += currentLine;

        console.log(`Instantly revealed line ${lineNumber}: "${currentLine}"`);
        this.lineRevealState.currentIndex++;

        // Show navigation message for manual progression
        if (navMsg) {
          navMsg.innerHTML =
            "press spacebar<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;to enter";
          navMsg.style.fontSize = "0.9rem";
          navMsg.style.visibility = "visible";
        }

        if (
          this.lineRevealState.currentIndex >= this.lineRevealState.lines.length
        ) {
          console.log("All lines revealed, finishing...");
          this.isAnimating = false;
          this.isInLineRevealMode = false;
          this.lineRevealState.onComplete && this.lineRevealState.onComplete();
        }
      }
    }
  }

  /**
   * Clear all animation timeouts and intervals
   */
  clearAllTimeouts() {
    this.lineRevealTimeouts.forEach((timeout) => clearTimeout(timeout));
    this.lineRevealTimeouts = [];

    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }

    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }

    if (this.currentTypingInterval) {
      clearInterval(this.currentTypingInterval);
      this.currentTypingInterval = null;
    }
  }

  /**
   * Reset typing state
   */
  resetTypingState() {
    this.shouldContinueTyping = false;
  }

  /**
   * Enable typing
   */
  enableTyping() {
    this.shouldContinueTyping = true;
  }

  /**
   * Check if currently animating
   */
  isCurrentlyAnimating() {
    return this.isAnimating;
  }

  /**
   * Check if in line reveal mode
   */
  isInLineReveal() {
    return this.isInLineRevealMode;
  }
}
