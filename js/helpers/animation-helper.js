/**
 * Animation Helper
 * Text scrambling and typewriter effects
 */

import { chars, animationConfig, isMobile } from "../constants.js";

export class AnimationHelper {
  constructor() {
    this.currentAnimationFrame = null;
    this.currentInterval = null;
    this.isAnimating = false;
  }

  /**
   * Mobile text wrapping - breaks long lines intelligently
   */
  wrapTextForMobile(text) {
    const mobile = isMobile();
    if (!mobile) return text;

    const lines = text.split("\n");
    const wrappedLines = [];
    const maxLineLength = 40;

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
          const prefix = indent + hasBullet;

          for (const word of words) {
            // Add space only if currentLine has content beyond the prefix
            const needsSpace = currentLine.length > prefix.length;
            const testLine = currentLine + (needsSpace ? " " : "") + word;

            if (testLine.length > maxLineLength) {
              if (currentLine.trim() !== prefix.trim()) {
                wrappedLines.push(currentLine);
                currentLine = indent + "  " + word;
              } else {
                currentLine += word;
              }
            } else {
              currentLine += (needsSpace ? " " : "") + word;
            }
          }

          if (currentLine.trim() !== prefix.trim()) {
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
   * Scramble text animation
   * @param {HTMLElement} element - Element to animate
   * @param {string} text - Text to reveal
   * @param {function} onComplete - Callback when animation completes
   * @param {boolean} playAudio - Whether to play audio (not used, kept for compatibility)
   * @param {object} options - Optional animation parameters
   * @param {number} options.chunkSize - Characters to reveal per step (default: 15)
   * @param {number} options.intervalMs - Milliseconds between steps (default: 100)
   * @param {number} options.initialDelayMs - Milliseconds to show scrambled text before animation (default: 0)
   */
  scrambleText(element, text, onComplete, playAudio = false, options = {}) {
    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }

    // Apply mobile text wrapping
    text = this.wrapTextForMobile(text);

    let index = 0;
    const chunkSize = options.chunkSize || animationConfig.scrambleChunkSize;
    const intervalMs = options.intervalMs || animationConfig.scrambleIntervalMs;
    const initialDelayMs = options.initialDelayMs || 0;
    const scrambled = text.split("");
    const len = text.length;

    // Initialize scrambled text
    for (let i = 0; i < len; i++) {
      scrambled[i] = /\s/.test(text[i])
        ? text[i]
        : chars[Math.floor(Math.random() * chars.length)];
    }

    this.isAnimating = true;

    // Show scrambled text immediately
    element.textContent = scrambled.join("");

    // Function to start the reveal animation
    const startRevealAnimation = () => {
      // Use requestAnimationFrame for better performance
      const stopAnimation = this.createRAFAnimation(() => {
        const display = scrambled.slice();

        // Reveal completed chunks
        for (let i = 0; i < index; i++) {
          let s = i * chunkSize;
          let e = Math.min(s + chunkSize, len);
          for (let j = s; j < e; j++) {
            display[j] = text[j];
          }
        }

        // Scramble remaining text
        for (let k = index * chunkSize; k < len; k++) {
          display[k] = /\s/.test(text[k])
            ? text[k]
            : chars[Math.floor(Math.random() * chars.length)];
        }

        element.textContent = display.join("");

        index++;
        if (index * chunkSize >= len) {
          stopAnimation();
          element.textContent = text;
          this.isAnimating = false;
          this.wrapYearsInSpans(element);
          onComplete && onComplete();
          return false; // Stop animation
        }
        return true; // Continue animation
      }, intervalMs);
    };

    // If there's an initial delay, wait before starting the reveal animation
    if (initialDelayMs > 0) {
      setTimeout(startRevealAnimation, initialDelayMs);
    } else {
      startRevealAnimation();
    }
  }

  /**
   * Typewriter effect for text
   */
  typewriterEffect(element, text, onComplete) {
    let charIndex = 0;
    const len = text.length;

    const typingInterval = setInterval(() => {
      if (charIndex < len) {
        element.textContent = text.substring(0, charIndex + 1);
        charIndex++;
      } else {
        clearInterval(typingInterval);
        onComplete && onComplete();
      }
    }, animationConfig.typewriterCharDelayMs);

    return typingInterval;
  }

  /**
   * Clear all animations
   */
  clearAnimations() {
    if (this.currentAnimationFrame) {
      cancelAnimationFrame(this.currentAnimationFrame);
      this.currentAnimationFrame = null;
    }
    if (this.currentInterval) {
      clearInterval(this.currentInterval);
      this.currentInterval = null;
    }
    this.isAnimating = false;
  }
}
