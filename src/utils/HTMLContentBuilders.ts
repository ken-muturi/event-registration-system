// HTML content builders for different display types

import { parseScriptureMarkup } from "./util";

export interface VerseData {
  id: number;
  Book: string;
  Chapter: number;
  Verse: number;
  Scripture: string;
  bookName: string;
}

export type Segment = {
  text: string;
  class: string;
};

/**
 * Creates HTML for verse display
 */
export function createVerseHTML(verse: VerseData, translation: string): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Bible Verse Display</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }
    .verse-container {
      padding: 5vh 4vw;
      text-align: center;
      max-width: 85vw;
      max-height: 85vh;
      width: 100%;
      transition: all 0.5s ease;
      overflow-y: auto;
    }
    .reference {
      font-size: clamp(48px, 6vw, 96px);
      font-weight: 800;
      margin-bottom: 3vh;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      letter-spacing: 2px;
    }
    .scripture {
      font-size: clamp(32px, 4vw, 64px);
      line-height: 1.6;
      margin-bottom: 3vh;
      font-weight: 600;
      max-width: 80%;
      margin-left: auto;
      margin-right: auto;
    }
    .translation {
      font-size: clamp(12px, 2vw, 24px);
      opacity: 0.9;
      font-weight: 500;
    }
    .close-hint {
      position: absolute;
      top: 30px;
      right: 30px;
      font-size: 18px;
      opacity: 0.6;
      color: rgba(255, 255, 255, 0.8);
      background: rgba(0, 0, 0, 0.2);
      padding: 10px 20px;
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      cursor: pointer;
    }
    .close-hint:hover {
      opacity: 0.9;
      background: rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="verse-container">
    <div class="scripture">
      ${verse.Chapter}:${verse.Verse} ${parseScriptureMarkup(verse.Scripture)}
    </div>
    <div class="translation">
      ${translation.toUpperCase()} ${verse.bookName} ${verse.Chapter}:${verse.Verse}
    </div>
  </div>
  <script>
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'F11') {
        window.close();
      }
    });
    
    function closeWindow() {
      window.close();
    }
    
    window.focus();
  </script>
</body>
</html>`;
}

/**
 * Creates HTML for welcome display
 */
export function createWelcomeHTML(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Display</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }
    .welcome-container {
      padding: 5vh 4vw;
      text-align: center;
      max-width: 85vw;
      max-height: 85vh;
      width: 100%;
    }
    .welcome-message {
      font-size: clamp(48px, 6vw, 96px);
      line-height: 1.4;
      margin-bottom: 3vh;
      font-weight: 700;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
    }
    .welcome-subtitle {
      font-size: clamp(20px, 3vw, 40px);
      opacity: 0.9;
      font-weight: 400;
    }
  </style>
</head>
<body>
  <div class="welcome-container">
    <div class="welcome-message">Welcome</div>
    <div class="welcome-subtitle">Scripture Display System</div>
  </div>
  <script>
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'F11') {
        window.close();
      }
    });
    window.focus();
  </script>
</body>
</html>`;
}

/**
 * Creates HTML for ready/standby display
 */
export function createReadyHTML(): string {
  return `<!DOCTYPE html>
<html>
<head>
  <title>Display Ready</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }
    .ready-container {
      padding: 5vh 4vw;
      text-align: center;
      max-width: 85vw;
      max-height: 85vh;
      width: 100%;
    }
    .ready-message {
      font-size: clamp(32px, 4vw, 64px);
      line-height: 1.6;
      margin-bottom: 3vh;
      font-weight: 600;
    }
    .ready-subtitle {
      font-size: clamp(16px, 2vw, 32px);
      opacity: 0.9;
      font-weight: 400;
    }
  </style>
</head>
<body>
  <div class="ready-container">
    <div class="ready-message">Ready for Display</div>
    <div class="ready-subtitle">Click any content to show here</div>
  </div>
  <script>
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'F11') {
        window.close();
      }
    });
    window.focus();
  </script>
</body>
</html>`;
}

/**
 * Generic HTML template builder
 */
export function createCustomDisplayHTML(
  title: string,
  content: string,
  styles?: string,
  scripts?: string
): string {
  const defaultStyles = `
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }
    .content-container {
      padding: 5vh 4vw;
      text-align: center;
      max-width: 85vw;
      max-height: 85vh;
      width: 100%;
      overflow-y: auto;
    }
  `;

  const defaultScripts = `
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'F11') {
        window.close();
      }
    });
    window.focus();
  `;

  return `<!DOCTYPE html>
<html>
<head>
  <title>${title}</title>
  <meta charset="utf-8">
  <style>
    ${defaultStyles}
    ${styles || ''}
  </style>
</head>
<body>
  <div class="content-container">
    ${content}
  </div>
  <script>
    ${defaultScripts}
    ${scripts || ''}
  </script>
</body>
</html>`;
}

/**
 * Creates HTML for welcome message slideshow
 */
export function createSlideshowHTML(
  segments: Segment[],
  currentIndex: number,
  isPlaying: boolean,
  showControls: boolean = true,
  showProgress: boolean = true
): string {
  const currentSegment = segments[currentIndex];
  if (!currentSegment) return '';

  const progressButtons = showProgress ? (`
    <div class="play-status">
      ${isPlaying ? "▶️ Playing" : "⏸️ Paused"} - ${currentIndex + 1}/${segments.length}
    </div>`
  ) : "";

  const progressIndicators = showControls ? (`
      <div class="progress-indicator">
    ${segments
      .map(
        (_, idx) =>
          `<div class="progress-dot ${idx === currentIndex ? "active" : ""}"></div>`
      )
      .join("")}
  </div>
`) : '';

  return `<!DOCTYPE html>
<html>
<head>
  <title>Welcome Message Slideshow</title>
  <meta charset="utf-8">
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      margin: 0;
      padding: 0;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      width: 100vw;
      height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      overflow: hidden;
      position: fixed;
      top: 0;
      left: 0;
    }
    .slide-content {
      padding: 5vh 4vw;
      text-align: center;
      max-width: 85vw;
      max-height: 85vh;
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .text-segment {
      font-size: clamp(28px, 4vw, 56px);
      line-height: 1.6;
      font-weight: 600;
      text-shadow: 0 4px 8px rgba(0,0,0,0.3);
      opacity: 0;
      transform: translateY(50px);
      animation: slideIn 0.8s ease forwards;
    }
    
    .segment-1 { color: #ffd700; font-weight: 800; }
    .segment-2 { color: #ffffff; }
    .segment-3 { color: #87ceeb; }
    .segment-4 { color: #98fb98; }
    .segment-5 { color: #ffb6c1; font-weight: 700; }
    
    .neon-text { text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700, 0 0 30px #ffd700; }
    .glow-text { text-shadow: 0 0 15px rgba(255, 255, 255, 0.8), 0 0 25px rgba(255, 255, 255, 0.6); }
    .rainbow-text { 
      background: linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4, #feca57);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      animation: rainbow-flow 3s ease-in-out infinite;
    }
    .pulse-text { animation: pulse 2s infinite; }
    .fire-text { 
      color: #ff6b6b; 
      text-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff4757, 0 0 30px #ff3742;
      animation: fire-flicker 1.5s infinite;
    }
    .shake-text { animation: shake 0.5s infinite; }
    .sparkle-text { 
      color: #ffd700; 
      animation: sparkle 1.5s infinite;
      text-shadow: 0 0 10px #ffd700, 0 0 20px #ffd700;
    }
    .electric-text { 
      color: #00ffff; 
      text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff;
      animation: electric-pulse 1s infinite;
    }
    .crystalline-text { 
      color: #e6e6fa; 
      text-shadow: 0 0 5px #e6e6fa, 0 0 15px #e6e6fa;
      animation: crystalline-shine 2s infinite;
    }
    .bold-text { font-weight: 900; }
    .underlined-text { 
      text-decoration: underline; 
      text-decoration-color: #ffd700;
      text-underline-offset: 0.2em;
    }
    
    .progress-indicator {
      position: fixed;
      bottom: 30px;
      left: 50%;
      transform: translateX(-50%);
      display: flex;
      gap: 8px;
    }
    .progress-dot {
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transition: all 0.3s ease;
    }
    .progress-dot.active {
      background: #ffd700;
      transform: scale(1.2);
    }
    
    .play-status {
      position: fixed;
      top: 30px;
      right: 30px;
      background: rgba(0, 0, 0, 0.2);
      padding: 10px 20px;
      border-radius: 25px;
      border: 1px solid rgba(255, 255, 255, 0.2);
      font-size: 14px;
      color: rgba(255, 255, 255, 0.8);
    }
    
    @keyframes slideIn {
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); }
      50% { transform: scale(1.05); }
    }
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      25% { transform: translateX(-2px); }
      75% { transform: translateX(2px); }
    }
    @keyframes sparkle {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.8; transform: scale(1.1); text-shadow: 0 0 20px #ffd700, 0 0 30px #ffd700; }
    }
    @keyframes rainbow-flow {
      0% { filter: hue-rotate(0deg); }
      100% { filter: hue-rotate(360deg); }
    }
    @keyframes fire-flicker {
      0%, 100% { text-shadow: 0 0 10px #ff6b6b, 0 0 20px #ff4757, 0 0 30px #ff3742; }
      50% { text-shadow: 0 0 20px #ff6b6b, 0 0 30px #ff4757, 0 0 40px #ff3742; }
    }
    @keyframes electric-pulse {
      0%, 100% { text-shadow: 0 0 10px #00ffff, 0 0 20px #00ffff, 0 0 30px #00ffff; }
      50% { text-shadow: 0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff; }
    }
    @keyframes crystalline-shine {
      0%, 100% { text-shadow: 0 0 5px #e6e6fa, 0 0 15px #e6e6fa; }
      50% { text-shadow: 0 0 15px #e6e6fa, 0 0 25px #e6e6fa, 0 0 35px #e6e6fa; }
    }
  </style>
</head>
<body>
  <div class="slide-content">
    <div class="text-segment ${currentSegment.class}">${currentSegment.text}</div>
  </div>
  

  ${progressIndicators}
  ${progressButtons}

  <script>
    // Listen for messages from parent
    window.addEventListener('message', function(event) {
      if (event.data.type === 'UPDATE_SLIDESHOW') {
        const { currentIndex, segments, isPlaying } = event.data;
        updateSlideshow(currentIndex, segments, isPlaying);
      }
    });
    
    function updateSlideshow(currentIndex, segments, isPlaying) {
      const segment = segments[currentIndex];
      if (segment) {
        const textElement = document.querySelector('.text-segment');
        textElement.className = 'text-segment ' + segment.class;
        textElement.innerHTML = segment.text;
        
        // Reset animation
        textElement.style.animation = 'none';
        textElement.offsetHeight; // Trigger reflow
        textElement.style.animation = 'slideIn 0.8s ease forwards';
      }
      
      // Update progress dots
      document.querySelectorAll('.progress-dot').forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
      
      // Update play status
      const statusElement = document.querySelector('.play-status');
      statusElement.textContent = (isPlaying ? '▶️ Playing' : '⏸️ Paused') + ' - ' + (currentIndex + 1) + '/' + segments.length;
    }
    
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' || e.key === 'F11') {
        window.close();
      }
    });
    
    window.focus();
  </script>
</body>
</html>`;
}